import { parse } from 'yaml'
import {
  resumeSchema,
  type Resume,
  type ResumeBasics,
  type ResumeEducation,
  type ResumeSalary,
  type WorkFormat,
} from '../schema/resume'

/** Месяцы в родительном падеже — для «сен 2025 — н. в.». */
const MONTHS = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
] as const

const CURRENCY_SIGNS: Record<ResumeSalary['currency'], string> = {
  RUR: '₽',
  USD: '$',
  EUR: '€',
}

const FORMAT_LABELS: Record<WorkFormat, string> = {
  remote: 'удалённо',
  hybrid: 'гибрид',
  office: 'офис',
}

/** Разбирает YAML и валидирует его схемой. Ошибки схемы — с путём поля. */
export function parseResume(raw: string): Resume {
  const data: unknown = parse(raw)
  return resumeSchema.parse(data)
}

/** `2025-09` → `сен 2025`. */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-')
  const index = Number(month) - 1
  const label = MONTHS[index]
  if (!label) {
    throw new Error(`Некорректный месяц: ${value}`)
  }
  return `${label} ${year}`
}

/** `2025-09`, `null` → `сен 2025 — н. в.`. */
export function formatPeriod(from: string, to: string | null): string {
  const start = formatMonth(from)
  return to ? `${start} — ${formatMonth(to)}` : `${start} — н. в.`
}

/** `225000` → `225 000 ₽ на руки, обсуждаемо`. */
export function formatSalary(salary: ResumeSalary): string {
  const amount = new Intl.NumberFormat('ru-RU').format(salary.amount)
  const period = salary.period === 'month' ? '' : ' в час'
  const note = salary.note ? ` ${salary.note}` : ''
  return `${amount} ${CURRENCY_SIGNS[salary.currency]}${period}${note}`
}

/** `['remote', 'hybrid']` → `удалённо, гибрид`. */
export function formatWorkFormats(formats: readonly WorkFormat[]): string {
  return formats.map((format) => FORMAT_LABELS[format]).join(', ')
}

/** Одна строка образования: вуз, факультет, специальность, год — без пустых частей. */
export function formatEducation(item: ResumeEducation): string {
  return [item.institution, item.faculty, item.degree, item.year ? String(item.year) : '']
    .filter(Boolean)
    .join(', ')
}

/** `https://mikeiv.github.io/resume/` → `mikeiv.github.io/resume` — для подписей в PDF и OG. */
export function siteAddress(url: string | undefined): string {
  if (!url) {
    return ''
  }
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** Полное имя одной строкой. */
export function fullName(basics: ResumeBasics): string {
  return [basics.lastName, basics.firstName, basics.patronymic].filter(Boolean).join(' ')
}

/** Короткое имя — «Михаил Иванов». */
export function shortName(basics: ResumeBasics): string {
  return `${basics.firstName} ${basics.lastName}`
}

/** Телефон в ссылке `tel:` без пробелов и дефисов. */
export function telHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, '')
  return `tel:${normalized}`
}

/** Телеграм в ссылке `https://t.me/...`. */
export function telegramHref(handle: string): string {
  return `https://t.me/${handle.replace(/^@/, '')}`
}

/** Плоский список технологий — для JSON-LD `knowsAbout` и поиска. */
export function flatSkills(resume: Resume): string[] {
  return resume.skills.flatMap((group) => group.items)
}

/** Адрес сайта с гарантированным слэшем на конце. */
export function siteUrl(base = ''): string {
  if (!base) {
    return ''
  }
  return base.endsWith('/') ? base : `${base}/`
}
