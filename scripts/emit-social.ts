import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { ROOT, readResume } from './lib'
import { flatSkills, fullName } from '../shared/utils/resume'

const DARK = '#0b0f14'
const ACCENT = '#37e2a0'

/** Технологии для карточки: важные для целевой роли, но только из реальных навыков. */
const PREFERRED_TAGS = ['Nuxt 4', 'Vue 3', 'TypeScript', 'Nitro', 'Prisma']

/** Карточка для соцсетей: имя, роль, ключевые технологии, контакты. */
function ogMarkup(name: string, role: string, tags: string[], contacts: string[]): string {
  return `<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; padding: 72px;
    display: flex; flex-direction: column; justify-content: space-between;
    color: #e8edf3; background:
      radial-gradient(circle at 12% 0%, rgba(6, 122, 82, 0.55), transparent 46%),
      radial-gradient(circle at 88% 18%, rgba(36, 92, 148, 0.45), transparent 42%),
      ${DARK};
    font-family: 'Inter', 'Segoe UI', 'Noto Sans', Arial, sans-serif;
  }
  .top { display: flex; align-items: center; gap: 14px; }
  .badge {
    padding: 7px 14px; border-radius: 999px; font-size: 20px; font-weight: 600;
    color: ${ACCENT}; background: rgba(55, 226, 160, 0.12); border: 1px solid rgba(55, 226, 160, 0.35);
  }
  h1 { font-size: 88px; line-height: 1.02; font-weight: 800; letter-spacing: -1.6px; max-width: 900px; }
  .role { margin-top: 18px; font-size: 34px; font-weight: 600; color: #9de9c6; }
  .tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .tag { padding: 9px 16px; border-radius: 10px; font-size: 24px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); }
  .bottom { display: flex; justify-content: space-between; align-items: flex-end; font-size: 24px; color: #9fb0c0; }
  .accent { color: ${ACCENT}; font-weight: 700; }
</style></head>
<body>
  <div>
    <div class="top"><span class="badge">Открыт к предложениям · Москва, удалённо</span></div>
    <h1>${name}</h1>
    <p class="role">${role}</p>
    <div class="tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
  </div>
  <div class="bottom">
    <span>${contacts.join(' · ')}</span>
    <span class="accent">mikeiv.github.io/resume</span>
  </div>
</body></html>`
}

function iconMarkup(): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 180px; height: 180px; display: grid; place-items: center; background: ${DARK}; }
  .mark { font-family: 'Segoe UI', 'Noto Sans', Arial, sans-serif; font-size: 76px; font-weight: 800; color: ${ACCENT}; letter-spacing: -2px; }
</style></head>
<body><div class="mark">МИ</div></body></html>`
}

/** Рисует `og.png` и `apple-touch-icon.png` из данных резюме. */
async function main(): Promise<void> {
  const resume = await readResume()
  const outputDir = join(ROOT, 'public')
  await mkdir(outputDir, { recursive: true })

  const name = fullName(resume.basics)
  const known = flatSkills(resume)
  const tags = PREFERRED_TAGS.filter((tag) =>
    known.some(
      (skill) => skill === tag || skill.startsWith(`${tag} `) || skill.startsWith(`${tag} (`),
    ),
  )
  const contacts = [resume.basics.contacts.email, resume.basics.contacts.phone]

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()

    await page.setViewportSize({ width: 1200, height: 630 })
    await page.setContent(ogMarkup(name, resume.basics.label, tags, contacts), {
      waitUntil: 'load',
    })
    await page.screenshot({ path: join(outputDir, 'og.png') })
    console.log('OG: public/og.png')

    await page.setViewportSize({ width: 180, height: 180 })
    await page.setContent(iconMarkup(), { waitUntil: 'load' })
    await page.screenshot({ path: join(outputDir, 'apple-touch-icon.png') })
    console.log('ICON: public/apple-touch-icon.png')
  } finally {
    await browser.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
