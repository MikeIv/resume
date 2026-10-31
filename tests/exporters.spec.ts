import { describe, expect, it } from 'vitest'
import { toHhPack, toJsonLd, toJsonResume, toLlmsTxt, toPlainText } from '../shared/utils/exporters'
import { loadTestResume } from './helpers'

const SITE = 'https://mikeiv.github.io/resume/'

describe('JSON Resume', () => {
  it('отдаёт обязательные поля схемы', async () => {
    const resume = await loadTestResume()
    const json = toJsonResume(resume, SITE)

    expect(json.$schema).toContain('jsonresume')
    expect(json.basics.name).toBe('Иванов Михаил Юрьевич')
    expect(json.basics.label).toContain('Nuxt')
    expect(json.basics.email).toContain('@')
    expect(json.basics.profiles.some((profile) => profile.network === 'GitHub')).toBe(true)
    expect(json.work).toHaveLength(resume.experience.length)
    expect(json.work[0]?.endDate).toBeUndefined()
    expect(json.projects.length).toBe(resume.projects.length)
    expect(json.projects.every((project) => project.keywords.length > 0)).toBe(true)
    expect(json.skills.length).toBe(resume.skills.length)
    expect(json.meta.canonical).toBe(SITE)
  })
})

describe('простой текст', () => {
  it('содержит разделы резюме и контакты', async () => {
    const resume = await loadTestResume()
    const text = toPlainText(resume)

    for (const heading of ['О СЕБЕ', 'КЛЮЧЕВЫЕ НАВЫКИ', 'ОПЫТ РАБОТЫ', 'ПРОЕКТЫ', 'РАННИЙ ОПЫТ']) {
      expect(text).toContain(heading)
    }
    expect(text).toContain('ИВАНОВ МИХАИЛ ЮРЬЕВИЧ')
    expect(text).toContain(resume.basics.contacts.email)
    expect(text).toContain('Nuxt 4')
  })
})

describe('llms.txt', () => {
  it('начинается заголовком и ссылается на артефакты', async () => {
    const resume = await loadTestResume()
    const txt = toLlmsTxt(resume, SITE)

    expect(txt.startsWith('# ')).toBe(true)
    expect(txt).toContain('> ')
    expect(txt).toContain(`${SITE}resume.json`)
    expect(txt).toContain(`${SITE}Ivanov-Mikhail-Nuxt-Fullstack.pdf`)
    expect(txt).toContain('## Профили')
  })
})

describe('JSON-LD', () => {
  it('описывает Person с навыками и профилями', async () => {
    const resume = await loadTestResume()
    const ld = toJsonLd(resume, SITE)

    expect(ld['@type']).toBe('Person')
    expect(ld['@context']).toBe('https://schema.org')
    expect(Array.isArray(ld.knowsAbout)).toBe(true)
    expect((ld.knowsAbout as string[]).length).toBeGreaterThan(20)
    expect(Array.isArray(ld.sameAs)).toBe(true)
    expect((ld.sameAs as string[])[0]).toContain('github.com')
    expect(ld.jobTitle).toBe(resume.basics.label)
  })
})

describe('hh-пакет', () => {
  it('содержит блоки для копирования и чек-лист', async () => {
    const resume = await loadTestResume()
    const pack = toHhPack(resume)

    expect(pack).toContain('# Пакет для hh.ru')
    expect(pack).toContain('## Заголовок резюме')
    expect(pack).toContain('## О себе')
    expect(pack).toContain('## Ранний опыт')
    expect(pack).toContain('## Ключевые навыки')
    expect(pack).toContain('## Портрет кандидата')
    expect(pack).toContain('## Чек-лист видимости')
    expect(pack).toContain('## Чек-лист')
    expect(pack).toContain(resume.basics.label)
    expect(pack).toContain(resume.basics.contacts.email)
    expect(pack).toContain(`Сайт: ${resume.basics.contacts.site}`)
  })

  it('собирает портрет кандидата из шести обязательных и четырёх желаемых критериев', async () => {
    const resume = await loadTestResume()
    const pack = toHhPack(resume)

    for (const label of [
      '1. Роль:',
      '2. Стек:',
      '3. Опыт:',
      '4. Формат:',
      '5. Город:',
      '6. Зарплата:',
    ]) {
      expect(pack).toContain(label)
    }
    expect(resume.hh).toBeDefined()
    expect(pack).toContain(`10. Процесс: ${resume.hh?.portrait.process ?? ''}`)
    expect(pack).not.toContain('11.')
  })

  it('укладывается в лимиты полей hh', async () => {
    const resume = await loadTestResume()
    const pack = toHhPack(resume)

    expect(resume.basics.label.length).toBeLessThanOrEqual(100)
    expect(resume.basics.summary.length).toBeLessThanOrEqual(5000)
    expect(resume.hh?.keywords?.length ?? 0).toBeLessThanOrEqual(30)
    expect(pack).toContain('> Лимит поля — 30 тегов.')
  })

  it('предлагает только существующие в hh специализации', async () => {
    const resume = await loadTestResume()
    const pack = toHhPack(resume)

    expect(pack).toContain('Специализации: Программист, разработчик')
    expect(pack).not.toMatch(/Специализации:.*Fullstack-разработчик/)
    expect(pack).not.toMatch(/Специализации:.*Frontend-разработчик/)
  })

  it('выводит образование и языки, когда они заполнены', async () => {
    const resume = await loadTestResume()
    const pack = toHhPack({
      ...resume,
      education: [{ institution: 'Тестовый вуз', faculty: 'Тестовый факультет', year: 2015 }],
      languages: [{ name: 'Английский', level: 'B2' }],
    })

    expect(pack).toContain('## Образование')
    expect(pack).toContain('Тестовый вуз, Тестовый факультет, 2015')
    expect(pack).toContain('## Языки')
    expect(pack).toContain('Английский — B2')
  })
})
