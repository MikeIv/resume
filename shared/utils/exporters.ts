import type { Resume } from '../schema/resume'
import {
  flatSkills,
  formatEducation,
  formatPeriod,
  formatSalary,
  formatWorkFormats,
  fullName,
  shortName,
  siteUrl,
} from './resume'

export interface JsonResumeProfile {
  network: string
  username: string
  url: string
}

export interface JsonResumeBasics {
  name: string
  label: string
  email: string
  url?: string
  summary: string
  location: { city: string; countryCode: string }
  profiles: JsonResumeProfile[]
}

export interface JsonResumeWork {
  name: string
  position: string
  startDate: string
  endDate?: string
  summary: string
  location?: string
  highlights: string[]
}

export interface JsonResumeProject {
  name: string
  description: string
  highlights: string[]
  keywords: string[]
  roles: string[]
  url?: string
}

export interface JsonResumeSkill {
  name: string
  keywords: string[]
}

export interface JsonResumeEducation {
  institution: string
  area?: string
  studyType?: string
  endDate?: string
}

export interface JsonResumeLanguage {
  language: string
  fluency: string
}

export interface JsonResume {
  $schema: string
  basics: JsonResumeBasics
  work: JsonResumeWork[]
  projects: JsonResumeProject[]
  skills: JsonResumeSkill[]
  education: JsonResumeEducation[]
  languages: JsonResumeLanguage[]
  meta: {
    canonical?: string
    version: string
    lastModified: string
  }
}

/** JSON Resume: машиночитаемая форма для агентов и ATS. */
export function toJsonResume(resume: Resume, canonicalUrl = ''): JsonResume {
  const { basics } = resume
  const profiles: JsonResumeProfile[] = [
    {
      network: 'GitHub',
      username: basics.contacts.github.replace(/^https?:\/\/(www\.)?github\.com\//, ''),
      url: basics.contacts.github,
    },
  ]

  if (basics.contacts.telegram) {
    profiles.push({
      network: 'Telegram',
      username: basics.contacts.telegram,
      url: `https://t.me/${basics.contacts.telegram}`,
    })
  }

  if (basics.contacts.hh) {
    profiles.push({ network: 'hh.ru', username: '', url: basics.contacts.hh })
  }

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: fullName(basics),
      label: basics.label,
      email: basics.contacts.email,
      url: canonicalUrl || basics.contacts.site,
      summary: basics.summary,
      location: { city: basics.location.city, countryCode: basics.location.countryCode },
      profiles,
    },
    work: resume.experience.map((job) => ({
      name: job.legalName ? `${job.company} (${job.legalName})` : job.company,
      position: job.position,
      startDate: job.from,
      endDate: job.to ?? undefined,
      summary: job.summary,
      location: job.location,
      highlights: job.achievements,
    })),
    projects: resume.projects.map((project) => ({
      name: project.name,
      description: `${project.tagline}. ${project.summary}`,
      highlights: project.results,
      keywords: project.stack,
      roles: [project.role],
      url: project.demo ?? project.code,
    })),
    skills: resume.skills.map((group) => ({ name: group.group, keywords: group.items })),
    education: resume.education.map((item) => ({
      institution: item.institution,
      area: item.faculty,
      studyType: item.degree,
      endDate: item.year ? String(item.year) : undefined,
    })),
    languages: resume.languages.map((item) => ({ language: item.name, fluency: item.level })),
    meta: {
      canonical: canonicalUrl || undefined,
      version: `v${resume.meta.version}`,
      lastModified: resume.meta.updated,
    },
  }
}

/** Простой текст: копируется в ATS и читается с телефона. */
export function toPlainText(resume: Resume): string {
  const { basics } = resume
  const lines: string[] = []

  lines.push(fullName(basics).toUpperCase())
  lines.push(basics.label)
  lines.push('')
  lines.push(
    [basics.location.city, formatWorkFormats(basics.formats), formatSalary(basics.salary)].join(
      ' · ',
    ),
  )

  const contacts = [
    basics.contacts.email,
    basics.contacts.telegram ? `Telegram @${basics.contacts.telegram}` : '',
    basics.contacts.github.replace(/^https?:\/\//, ''),
    basics.contacts.hh ?? '',
  ].filter(Boolean)
  lines.push(contacts.join(' · '))
  lines.push('')
  lines.push('О СЕБЕ')
  lines.push(basics.summary)
  lines.push('')
  lines.push('КЛЮЧЕВЫЕ НАВЫКИ')
  lines.push(flatSkills(resume).join(', '))
  lines.push('')
  lines.push('ОПЫТ РАБОТЫ')

  for (const job of resume.experience) {
    lines.push('')
    lines.push(formatPeriod(job.from, job.to))
    lines.push(
      job.legalName
        ? `${job.company} (${job.legalName}) — ${job.position}`
        : `${job.company} — ${job.position}`,
    )
    if (job.location) {
      lines.push(job.location)
    }
    lines.push(job.summary)
    for (const achievement of job.achievements) {
      lines.push(`- ${achievement}`)
    }
    if (job.stack.length > 0) {
      lines.push(`Стек: ${job.stack.join(', ')}`)
    }
  }

  lines.push('')
  lines.push('ПРОЕКТЫ')
  for (const project of resume.projects) {
    lines.push('')
    lines.push(`${project.name} (${project.period}) — ${project.role}`)
    lines.push(`${project.tagline}. ${project.summary}`)
    for (const result of project.results) {
      lines.push(`- ${result}`)
    }
    lines.push(`Стек: ${project.stack.join(', ')}`)
    if (project.demo) {
      lines.push(`Демо: ${project.demo}`)
    }
    if (project.code) {
      lines.push(`Код: ${project.code}`)
    }
  }

  lines.push('')
  lines.push('РАННИЙ ОПЫТ')
  for (const item of resume.earlyExperience) {
    lines.push(`${item.period} — ${item.text}`)
  }

  if (resume.education.length > 0) {
    lines.push('')
    lines.push('ОБРАЗОВАНИЕ')
    for (const item of resume.education) {
      lines.push(formatEducation(item))
    }
  }

  if (resume.languages.length > 0) {
    lines.push('')
    lines.push('ЯЗЫКИ')
    for (const language of resume.languages) {
      lines.push(`${language.name} — ${language.level}`)
    }
  }

  lines.push('')
  lines.push(`Обновлено: ${resume.meta.updated}`)
  lines.push('')

  return lines.join('\n')
}

/** `llms.txt`: короткая карта машиночитаемых артефактов. */
export function toLlmsTxt(resume: Resume, base = ''): string {
  const root = siteUrl(base)
  const { basics } = resume

  return [
    `# ${fullName(basics)} — ${basics.label}`,
    '',
    `> ${basics.headline}`,
    '',
    '## Резюме',
    '',
    `- [HTML](${root}): основная страница с опытом и проектами`,
    `- [PDF](${root}Ivanov-Mikhail-Nuxt-Fullstack.pdf): версия для ATS и HR`,
    `- [DOCX](${root}Ivanov-Mikhail-Nuxt-Fullstack.docx): редактируемая версия`,
    `- [JSON Resume](${root}resume.json): структурированные данные`,
    `- [Простой текст](${root}resume.txt): копирование без разметки`,
    '',
    '## Профили',
    '',
    `- [GitHub](${basics.contacts.github})`,
    `- [Telegram](https://t.me/${basics.contacts.telegram ?? ''})`,
    ...(basics.contacts.hh ? [`- [hh.ru](${basics.contacts.hh})`] : []),
    '',
    '## Контакты',
    '',
    `- E-mail: ${basics.contacts.email}`,
    `- Город: ${basics.location.city}, ${basics.location.countryCode}`,
    `- Формат: ${formatWorkFormats(basics.formats)}`,
    `- Ожидания: ${formatSalary(basics.salary)}`,
    '',
  ].join('\n')
}

/** Разметка schema.org/Person для поисковых и агентских краулеров. */
export function toJsonLd(resume: Resume, base = ''): Record<string, unknown> {
  const { basics } = resume
  const root = siteUrl(base)
  const currentJob = resume.experience.find((job) => job.to === null)

  const sameAs = [basics.contacts.github]
  if (basics.contacts.telegram) {
    sameAs.push(`https://t.me/${basics.contacts.telegram}`)
  }
  if (basics.contacts.hh) {
    sameAs.push(basics.contacts.hh)
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName(basics),
    alternateName: shortName(basics),
    jobTitle: basics.label,
    description: basics.summary,
    url: root || basics.contacts.site,
    email: `mailto:${basics.contacts.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: basics.location.city,
      addressCountry: basics.location.countryCode,
    },
    sameAs,
    knowsAbout: flatSkills(resume),
    knowsLanguage: resume.languages.map((language) => language.name),
    worksFor: currentJob ? { '@type': 'Organization', name: currentJob.company } : undefined,
    alumniOf: resume.education.map((item) => ({
      '@type': 'EducationalOrganization',
      name: item.institution,
    })),
  }
}

/** Ядро стека для портрета кандидата: первые две группы навыков — язык с фреймворком и сервер. */
function coreStack(resume: Resume): string[] {
  return resume.skills.slice(0, 2).flatMap((group) => group.items)
}

/** 6 обязательных критериев «портрета кандидата» — всё выводится из `data/resume.yaml`. */
function portraitRequired(resume: Resume): string[] {
  const { basics } = resume
  const experience = basics.stats.map((stat) => `${stat.value} ${stat.label}`).join(', ')

  return [
    `Роль: ${basics.label}`,
    `Стек: ${coreStack(resume).join(', ')}`,
    `Опыт: ${experience}`,
    `Формат: ${formatWorkFormats(basics.formats)}`,
    `Город: ${basics.location.city}`,
    `Зарплата: ${formatSalary(basics.salary)}`,
  ]
}

/** 4 желаемых критерия — из блока `hh.portrait`, если он заполнен. */
function portraitDesired(resume: Resume): string[] {
  const portrait = resume.hh?.portrait

  if (!portrait) {
    return []
  }

  return [
    `Домен: ${portrait.domain}`,
    `Продукт: ${portrait.product}`,
    `Команда: ${portrait.team}`,
    `Процесс: ${portrait.process}`,
  ]
}

/** Лимит тегов в поле KEYWORDS у hh. */
const HH_KEYWORD_LIMIT = 30

/** Теги для hh: курируемый `hh.keywords`, иначе все навыки резюме в пределах лимита. */
function hhKeywords(resume: Resume): string[] {
  return (resume.hh?.keywords ?? flatSkills(resume)).slice(0, HH_KEYWORD_LIMIT)
}

/** Пакет текстов для ручного обновления профиля hh.ru. */
export function toHhPack(resume: Resume): string {
  const { basics } = resume
  const lines: string[] = []

  lines.push('# Пакет для hh.ru')
  lines.push('')
  lines.push('> Копировать блоками в интерфейс hh.ru. Лимиты полей интерфейс показывает сам —')
  lines.push('> если блок не влезает, сокращайте с конца, сохраняя технологии и цифры.')
  lines.push('')
  lines.push('## Заголовок резюме (поле POSITION)')
  lines.push('')
  lines.push('```')
  lines.push(basics.label)
  lines.push('```')
  lines.push('')
  lines.push('## Контакты профиля')
  lines.push('')
  lines.push('```')
  lines.push(`E-mail: ${basics.contacts.email}`)
  if (basics.contacts.telegram) {
    lines.push(`Telegram: @${basics.contacts.telegram}`)
  }
  lines.push(`GitHub: ${basics.contacts.github}`)
  if (basics.contacts.site) {
    lines.push(`Сайт: ${basics.contacts.site}`)
  }
  if (basics.contacts.hh) {
    lines.push(`Резюме на hh: ${basics.contacts.hh}`)
  }
  lines.push('```')
  lines.push('')
  lines.push('## Желаемая должность и специализации')
  lines.push('')
  lines.push('```')
  lines.push('Fullstack-разработчик, Frontend-разработчик, Программист, разработчик')
  lines.push('Специализации: Программист, разработчик; Frontend-разработчик; Fullstack-разработчик')
  lines.push('```')
  lines.push('')
  lines.push('## О себе')
  lines.push('')
  lines.push('```')
  lines.push(basics.summary)
  lines.push('')
  lines.push(`Формат: ${formatWorkFormats(basics.formats)}. Город: ${basics.location.city}.`)
  lines.push('```')
  lines.push('')
  lines.push('## Опыт работы')
  lines.push('')

  for (const job of resume.experience) {
    lines.push(`### ${job.company}${job.legalName ? ` (${job.legalName})` : ''}`)
    lines.push('')
    lines.push(`- Должность: ${job.position}`)
    lines.push(`- Период: ${formatPeriod(job.from, job.to)}`)
    if (job.location) {
      lines.push(`- Город: ${job.location}`)
    }
    lines.push('')
    lines.push('```')
    lines.push(job.summary)
    for (const achievement of job.achievements) {
      lines.push(`- ${achievement}`)
    }
    if (job.stack.length > 0) {
      lines.push(`Стек: ${job.stack.join(', ')}`)
    }
    lines.push('```')
    lines.push('')
  }

  lines.push('## Ранний опыт (по выписке СФР)')
  lines.push('')
  lines.push('```')
  for (const item of resume.earlyExperience) {
    lines.push(`${item.period} — ${item.text}`)
  }
  lines.push('```')
  lines.push('')

  lines.push('## Ключевые навыки (поле KEYWORDS)')
  lines.push('')
  lines.push(`> Лимит поля — ${HH_KEYWORD_LIMIT} тегов.`)
  const keywords = hhKeywords(resume)
  if (keywords.length < flatSkills(resume).length) {
    lines.push(
      `> Здесь ${keywords.length} из ${flatSkills(resume).length}: остальные навыки — в «О себе» и опыте.`,
    )
  }
  lines.push('')
  lines.push('```')
  lines.push(keywords.join(', '))
  lines.push('```')
  lines.push('')

  if (resume.education.length > 0) {
    lines.push('## Образование')
    lines.push('')
    lines.push('```')
    for (const item of resume.education) {
      lines.push(formatEducation(item))
    }
    lines.push('```')
    lines.push('')
  }

  if (resume.languages.length > 0) {
    lines.push('## Языки')
    lines.push('')
    lines.push('```')
    for (const language of resume.languages) {
      lines.push(`${language.name} — ${language.level}`)
    }
    lines.push('```')
    lines.push('')
  }

  lines.push('## Ожидания')
  lines.push('')
  lines.push('```')
  lines.push(`Желаемая зарплата: ${formatSalary(basics.salary)}`)
  lines.push(`Занятость: полная. Формат: ${formatWorkFormats(basics.formats)}.`)
  lines.push('```')
  lines.push('')
  lines.push('## Портрет кандидата (AI-ассистент hh)')
  lines.push('')
  lines.push('> Поле «Портрет кандидата»: 6 обязательных критериев выводятся из данных резюме,')
  lines.push('> 4 желаемых — из блока `hh.portrait` в `data/resume.yaml`. Правьте там, не здесь.')
  lines.push('')
  lines.push('```')

  const required = portraitRequired(resume)
  const desired = portraitDesired(resume)
  required.forEach((line, index) => {
    lines.push(`${index + 1}. ${line}`)
  })
  desired.forEach((line, index) => {
    lines.push(`${required.length + index + 1}. ${line}`)
  })

  lines.push('```')
  lines.push('')
  lines.push('## Чек-лист видимости')
  lines.push('')
  lines.push('- [ ] Видимость резюме: «Видно всем работодателям», а не только по ссылке')
  lines.push('- [ ] Бесплатный подъём резюме в поиске (доступен раз в 4 часа)')
  lines.push('- [ ] Поиск по `POSITION:` находит резюме — заголовок из блока выше')
  lines.push('- [ ] Поиск по `KEYWORDS:` находит резюме — первые пять навыков из блока выше')
  lines.push('- [ ] Дата обновления на hh свежая, резюме сохранено после правок')
  lines.push('')
  lines.push('## Чек-лист после правок')
  lines.push('')
  lines.push('- [ ] Заголовок, «О себе», навыки и опыт совпадают с этим пакетом')
  lines.push('- [ ] Образование и языки на hh совпадают с блоками выше')
  lines.push('- [ ] Проверено на телефоне: текст не разъезжается')
  lines.push('')

  return lines.join('\n')
}
