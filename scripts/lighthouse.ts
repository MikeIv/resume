import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { ROOT, waitForServer } from './lib'
import { startStaticServer, stopStaticServer } from './static-server'

const PORT = 4319
const URL = `http://127.0.0.1:${PORT}/`

const THRESHOLDS = {
  performance: 0.95,
  accessibility: 1,
  'best-practices': 0.95,
  seo: 0.95,
} as const

/** Гоняет Lighthouse по собранному сайту и проверяет пороги. */
async function main(): Promise<void> {
  const server = await startStaticServer(join(ROOT, '.output', 'public'), PORT)
  const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] })

  try {
    await waitForServer(URL)

    const result = await lighthouse(URL, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: Object.keys(THRESHOLDS),
    })

    if (!result) {
      throw new Error('Lighthouse не вернул результат')
    }

    const { lhr } = result
    await mkdir(join(ROOT, '.preview'), { recursive: true })
    await writeFile(join(ROOT, '.preview', 'lighthouse.json'), JSON.stringify(lhr, null, 2))

    let failed = false

    for (const [id, threshold] of Object.entries(THRESHOLDS)) {
      const score = lhr.categories[id]?.score ?? 0
      const passed = score >= threshold
      failed ||= !passed
      console.log(
        `${id.padEnd(15)} ${(score * 100).toFixed(0).padStart(3)} ${passed ? 'ok' : `ниже порога ${threshold * 100}`}`,
      )
    }

    const violations = Object.values(lhr.audits).filter(
      (audit) =>
        audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'notApplicable',
    )
    for (const audit of violations.slice(0, 12)) {
      console.log(`- ${audit.id}: ${audit.title}`)
    }

    if (failed) {
      process.exitCode = 1
    }
  } finally {
    await chrome.kill()
    stopStaticServer(server)
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
