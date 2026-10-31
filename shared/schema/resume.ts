import { z } from 'zod'

/** Месяц в формате `YYYY-MM` — единственный допустимый вид дат в данных. */
const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Ожидается месяц в формате YYYY-MM')

const nonEmpty = z.string().trim().min(1)

export const contactSchema = z.object({
  email: z.email(),
  phone: nonEmpty,
  telegram: nonEmpty.optional(),
  github: z.url(),
  /** Публичная ссылка на резюме hh.ru — появляется после публикации профиля. */
  hh: z.url().optional(),
  /** Адрес сайта — заполняется после деплоя. */
  site: z.url().optional(),
})

export const salarySchema = z.object({
  amount: z.number().int().positive(),
  currency: z.enum(['RUR', 'USD', 'EUR']),
  period: z.enum(['month', 'hour']),
  note: nonEmpty.optional(),
})

export const locationSchema = z.object({
  city: nonEmpty,
  countryCode: z.string().length(2),
  timezone: nonEmpty,
})

/** Короткие проверяемые цифры для первого экрана. */
export const statSchema = z.object({
  value: z.string().trim().min(1).max(12),
  label: nonEmpty,
})

export const experienceSchema = z.object({
  company: nonEmpty,
  legalName: nonEmpty.optional(),
  position: nonEmpty,
  from: monthSchema,
  /** `null` — текущее место работы. */
  to: monthSchema.nullable(),
  location: nonEmpty.optional(),
  summary: nonEmpty,
  achievements: z.array(nonEmpty).min(1),
  stack: z.array(nonEmpty),
})

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Только латиница в нижнем регистре, цифры и дефис'),
  name: nonEmpty,
  tagline: nonEmpty,
  role: nonEmpty,
  /** Год или диапазон; в YAML может прийти числом — приводим к строке. */
  period: z.coerce.string().trim().min(1),
  stack: z.array(nonEmpty).min(1),
  summary: nonEmpty,
  results: z.array(nonEmpty).min(1),
  demo: z.url().optional(),
  code: z.url().optional(),
  featured: z.boolean().default(false),
})

export const skillGroupSchema = z.object({
  group: nonEmpty,
  items: z.array(nonEmpty).min(1),
})

export const agenticItemSchema = z.object({
  title: nonEmpty,
  text: nonEmpty,
})

export const educationSchema = z.object({
  institution: nonEmpty,
  faculty: nonEmpty.optional(),
  degree: nonEmpty.optional(),
  year: z.number().int().min(1950).max(2100).optional(),
})

export const languageSchema = z.object({
  name: nonEmpty,
  level: nonEmpty,
})

export const earlyExperienceSchema = z.object({
  period: nonEmpty,
  text: nonEmpty,
})

/** Желаемые критерии «портрета кандидата» для AI-ассистента hh. */
export const hhPortraitSchema = z.object({
  /** Домен: в какой отрасли и на каких задачах хочется работать. */
  domain: nonEmpty,
  /** Продукт: что за сервис и на каком стеке он живёт. */
  product: nonEmpty,
  /** Команда: размер, роли, распределение задач. */
  team: nonEmpty,
  /** Процесс: как ведутся задачи, проверки и релизы. */
  process: nonEmpty,
})

/** Настройки профиля hh, которые не выводятся из остальных данных резюме. */
export const hhSchema = z.object({
  portrait: hhPortraitSchema,
  /** Теги для поля KEYWORDS: интерфейс hh принимает не больше 30. */
  keywords: z.array(nonEmpty).min(1).max(30).optional(),
})

export const seoSchema = z.object({
  title: z.string().trim().min(10).max(70),
  description: z.string().trim().min(50).max(180),
})

export const resumeSchema = z.object({
  meta: z.object({
    version: z.number().int().positive(),
    updated: z.iso.date(),
    locale: z.string().min(2),
  }),
  basics: z.object({
    firstName: nonEmpty,
    lastName: nonEmpty,
    patronymic: nonEmpty.optional(),
    /** Заголовок резюме: роль + стек в скобках, 60–90 символов. */
    label: z.string().trim().min(20).max(100),
    headline: z.string().trim().min(40).max(220),
    summary: z.string().trim().min(200).max(1200),
    location: locationSchema,
    formats: z.array(z.enum(['remote', 'hybrid', 'office'])).min(1),
    salary: salarySchema,
    contacts: contactSchema,
    stats: z.array(statSchema).min(1).max(4),
  }),
  experience: z.array(experienceSchema).min(1),
  projects: z.array(projectSchema).min(1),
  skills: z.array(skillGroupSchema).min(1),
  agentic: z.object({
    heading: nonEmpty,
    lead: z.string().trim().min(80),
    items: z.array(agenticItemSchema).min(2),
  }),
  education: z.array(educationSchema),
  languages: z.array(languageSchema),
  /** Пожелания к работе для AI-ассистента hh: 4 критерия поверх выводимых из резюме. */
  hh: hhSchema.optional(),
  earlyExperience: z.array(earlyExperienceSchema).min(1),
  seo: seoSchema,
})

export type Resume = z.infer<typeof resumeSchema>
export type ResumeBasics = Resume['basics']
export type ResumeExperience = z.infer<typeof experienceSchema>
export type ResumeProject = z.infer<typeof projectSchema>
export type ResumeSkillGroup = z.infer<typeof skillGroupSchema>
export type ResumeEducation = z.infer<typeof educationSchema>
export type ResumeLanguage = z.infer<typeof languageSchema>
export type ResumeEarlyExperience = z.infer<typeof earlyExperienceSchema>
export type ResumeHh = z.infer<typeof hhSchema>
export type ResumeHhPortrait = z.infer<typeof hhPortraitSchema>
export type ResumeLocation = z.infer<typeof locationSchema>
export type ResumeSalary = z.infer<typeof salarySchema>
export type ResumeContacts = z.infer<typeof contactSchema>
export type ResumeStat = z.infer<typeof statSchema>
export type ResumeMeta = Resume['meta']
export type ResumeAgentic = Resume['agentic']
export type ResumeSeo = z.infer<typeof seoSchema>
export type WorkFormat = ResumeBasics['formats'][number]
