import { mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { ROOT } from './lib'

const PROFILE_DIR = join(ROOT, '.dsh', 'hh-profile')
const SHOTS_DIR = join(ROOT, 'docs', 'hh')
const NAME_PATTERN = /^[a-z0-9-]{1,40}$/
/** hh догружает блоки профиля запросами после DOM — даём странице успокоиться. */
const SETTLE_MS = 2500

/** Проверяет аргументы: адрес раздела hh и имя файла кадра. */
function readArgs(): { url: string; name: string } {
  const [rawUrl, name] = process.argv.slice(2)

  if (!rawUrl || !name) {
    throw new Error('Использование: pnpm hh:shot <url> <имя-кадра> [--full]')
  }

  const url = new URL(rawUrl)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`Ожидается http(s)-адрес, получено: ${rawUrl}`)
  }
  if (!NAME_PATTERN.test(name)) {
    throw new Error(`Имя кадра — латиница в нижнем регистре, цифры и дефис: ${name}`)
  }

  return { url: url.toString(), name }
}

/** Снимает кадр раздела hh сохранённой сессией: страницу открывает агент, смотрит человек. */
async function main(): Promise<void> {
  const { url, name } = readArgs()
  const fullPage = process.argv.includes('--full')

  try {
    await stat(PROFILE_DIR)
  } catch {
    throw new Error('Нет сохранённой сессии: сначала выполните pnpm hh:login')
  }

  await mkdir(SHOTS_DIR, { recursive: true })

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1440, height: 960 },
    locale: 'ru-RU',
  })

  try {
    const page = context.pages()[0] ?? (await context.newPage())
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(SETTLE_MS)
    const target = join(SHOTS_DIR, `${name}.png`)
    await page.screenshot({ path: target, fullPage })
    console.log(`Скриншот: docs/hh/${name}.png`)
  } finally {
    await context.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
