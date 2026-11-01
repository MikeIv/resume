import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseResume } from '../shared/utils/resume'

const DATA = join(process.cwd(), 'data', 'resume.yaml')

describe('resume.yaml', () => {
  it('разбирается и проходит схему', async () => {
    const raw = await readFile(DATA, 'utf8')
    const resume = parseResume(raw)

    expect(resume.basics.label.length).toBeGreaterThanOrEqual(20)
    expect(resume.basics.label.length).toBeLessThanOrEqual(100)
    expect(resume.basics.summary.length).toBeGreaterThanOrEqual(200)
    expect(resume.basics.summary.length).toBeLessThanOrEqual(1200)
    expect(resume.experience.length).toBeGreaterThanOrEqual(3)
    expect(resume.projects.length).toBeGreaterThanOrEqual(3)
    expect(resume.skills.length).toBeGreaterThanOrEqual(3)
  })

  it('указывает адрес сайта и контакты', async () => {
    const resume = parseResume(await readFile(DATA, 'utf8'))

    expect(resume.basics.contacts.site).toMatch(/^https:\/\//)
    expect(resume.basics.contacts.email).toContain('@')
  })

  it('содержит ровно одно текущее место работы', async () => {
    const resume = parseResume(await readFile(DATA, 'utf8'))
    const current = resume.experience.filter((job) => job.to === null)

    expect(current).toHaveLength(1)
    expect(current[0]?.company).toMatch(/Гранд/)
  })

  it('опыты отсортированы от нового к старому', async () => {
    const resume = parseResume(await readFile(DATA, 'utf8'))
    const months = resume.experience.map((job) => Number(job.from.replace('-', '')))

    expect(months).toEqual([...months].sort((a, b) => b - a))
  })

  it('не содержит телефона или почты в свободных текстах проектов', async () => {
    const resume = parseResume(await readFile(DATA, 'utf8'))
    const texts = [
      ...resume.experience.flatMap((job) => [job.summary, ...job.achievements]),
      ...resume.projects.flatMap((project) => [project.summary, ...project.results]),
      resume.basics.summary,
    ]

    for (const text of texts) {
      expect(text).not.toMatch(/\+7\s?\d{3}/)
      expect(text).not.toMatch(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
    }
  })

  it('отклоняет неизвестный формат занятости', async () => {
    const raw = await readFile(DATA, 'utf8')
    const broken = raw.replace('formats: [remote, hybrid, office]', 'formats: [remote, planet]')

    expect(() => parseResume(broken)).toThrow()
  })

  it('отклоняет пустой опыт', async () => {
    const raw = await readFile(DATA, 'utf8')
    const broken = raw.replace(/experience:[\s\S]*?\nprojects:/, 'experience: []\nprojects:')

    expect(() => parseResume(broken)).toThrow()
  })
})
