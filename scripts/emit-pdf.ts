import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { ROOT, publishToBuild, waitForServer } from './lib'
import { startStaticServer, stopStaticServer } from './static-server'

const PORT = 4317
const PDF_NAME = 'Ivanov-Mikhail-Nuxt-Fullstack.pdf'

async function main(): Promise<void> {
  const publicDir = join(ROOT, '.output', 'public')
  const outputDir = join(ROOT, 'public')
  await mkdir(outputDir, { recursive: true })

  const server = await startStaticServer(publicDir, PORT)

  try {
    const url = `http://127.0.0.1:${PORT}/ats/`
    await waitForServer(url)

    const browser = await chromium.launch()
    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.emulateMedia({ media: 'print' })
      const target = join(outputDir, PDF_NAME)
      await page.pdf({
        path: target,
        format: 'A4',
        printBackground: true,
        /** Пять процентов запаса по высоте: без него блок опыта переезжает на третью страницу. */
        scale: 0.95,
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
      })
      await publishToBuild(target)
      console.log(`PDF: public/${PDF_NAME}`)
    } finally {
      await browser.close()
    }
  } finally {
    stopStaticServer(server)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
