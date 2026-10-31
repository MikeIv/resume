import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, type BrowserContext, type Page } from 'playwright'
import { ROOT } from './lib'

const PROFILE_DIR = join(ROOT, '.dsh', 'hh-profile')
const STATE_FILE = join(PROFILE_DIR, 'state.json')
const SHOTS_DIR = join(ROOT, 'docs', 'hh')
const LOGIN_URL = 'https://hh.ru/account/login'
const RESUMES_URL = 'https://hh.ru/applicant/resumes'

/** Логин, пароль и код из SMS вводит человек — ждём до 15 минут. */
const LOGIN_WAIT_MS = 15 * 60 * 1000
const POLL_MS = 2000
/** Страница должна трижды подряд оказаться вне формы входа: hh редиректит поэтапно. */
const CONFIRMATIONS = 3

/** Страница ушла с формы логина на hh — значит человек вошёл. */
function isLoggedIn(page: Page | undefined): boolean {
  const url = page?.url() ?? ''
  return url.includes('hh.ru') && !url.includes('/account/login')
}

/** Ждёт ручного входа и отдаёт страницу, на которой он завершился. */
async function waitForLogin(context: BrowserContext): Promise<Page> {
  const startedAt = Date.now()
  let confirmations = 0

  while (Date.now() - startedAt < LOGIN_WAIT_MS) {
    const page = context.pages().at(-1)
    confirmations = isLoggedIn(page) ? confirmations + 1 : 0
    if (page && confirmations >= CONFIRMATIONS) {
      return page
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS))
  }

  throw new Error(
    `Вход не завершён за ${LOGIN_WAIT_MS / 60_000} мин. Запустите pnpm hh:login заново.`,
  )
}

/** Открывает hh.ru в видимом окне: человек входит сам, агент сохраняет сессию и кадр. */
async function main(): Promise<void> {
  await mkdir(SHOTS_DIR, { recursive: true })

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1440, height: 960 },
    locale: 'ru-RU',
  })

  try {
    const page = context.pages()[0] ?? (await context.newPage())
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' })
    console.log('Войдите на hh.ru в открытом окне: логин, пароль и код из SMS — ваши.')
    console.log(
      `Сессия сохранится в .dsh/hh-profile, ждём вход (до ${LOGIN_WAIT_MS / 60_000} мин).`,
    )

    const logged = await waitForLogin(context)
    await context.storageState({ path: STATE_FILE })
    console.log('Вход выполнен, storageState: .dsh/hh-profile/state.json')

    await logged.goto(RESUMES_URL, { waitUntil: 'domcontentloaded' })
    await logged.waitForTimeout(3000)
    const shot = join(SHOTS_DIR, '00-profile-before.png')
    await logged.screenshot({ path: shot, fullPage: true })
    console.log('Скриншот профиля: docs/hh/00-profile-before.png')

    console.log('Дальше: pnpm hh:shot <url> <имя-кадра> — кадр нужного раздела в docs/hh/.')
  } finally {
    await context.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
