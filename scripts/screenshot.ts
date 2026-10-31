import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, type Page } from 'playwright'
import { ROOT, waitForServer } from './lib'
import { startStaticServer, stopStaticServer } from './static-server'

const PORT = 4318

/** Мобильные кадры снимаем по экранам: страница целиком не влезает в лимит превью. */
async function mobileShots(page: Page, outputDir: string): Promise<void> {
  const positions: Array<{ name: string; scroll: number | 'bottom' }> = [
    { name: 'mobile-top', scroll: 0 },
    { name: 'mobile-mid', scroll: 2200 },
    { name: 'mobile-bottom', scroll: 'bottom' },
  ]

  for (const position of positions) {
    await page.evaluate((target) => {
      const top = target === 'bottom' ? document.body.scrollHeight : target
      window.scrollTo({ top, behavior: 'instant' })
    }, position.scroll)
    await page.waitForTimeout(400)
    await page.screenshot({ path: join(outputDir, `${position.name}.png`) })
    console.log(`скриншот: .preview/${position.name}.png`)
  }
}

/** Снимает скриншоты собранного сайта для проверки вёрстки. */
async function main(): Promise<void> {
  const publicDir = join(ROOT, '.output', 'public')
  const outputDir = join(ROOT, '.preview')
  await mkdir(outputDir, { recursive: true })

  const server = await startStaticServer(publicDir, PORT)

  try {
    const url = `http://127.0.0.1:${PORT}/`
    await waitForServer(url)

    const browser = await chromium.launch()
    try {
      const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 } })
      await desktop.goto(url, { waitUntil: 'networkidle' })
      await desktop.screenshot({ path: join(outputDir, 'desktop.png'), fullPage: true })
      console.log('скриншот: .preview/desktop.png')

      await desktop.goto(`http://127.0.0.1:${PORT}/ats/`, { waitUntil: 'networkidle' })
      await desktop.screenshot({ path: join(outputDir, 'ats.png'), fullPage: true })
      console.log('скриншот: .preview/ats.png')
      await desktop.close()

      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
      await mobile.goto(url, { waitUntil: 'networkidle' })
      await mobileShots(mobile, outputDir)
      await mobile.close()
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
