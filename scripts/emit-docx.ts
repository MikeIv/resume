import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'
import {
  flatSkills,
  formatPeriod,
  formatSalary,
  formatWorkFormats,
  fullName,
} from '../shared/utils/resume'
import { ROOT, publishToBuild, readResume } from './lib'

const DOCX_NAME = 'Ivanov-Mikhail-Nuxt-Fullstack.docx'

function heading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20 })],
  })
}

function body(text: string): Paragraph {
  return new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text, size: 21 })] })
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 21 })],
  })
}

async function main(): Promise<void> {
  const resume = await readResume()
  const { basics } = resume

  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: fullName(basics), bold: true, size: 36 })],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: basics.label, size: 24 })],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `${basics.location.city}, ${basics.location.countryCode} · ${formatWorkFormats(basics.formats)} · ${formatSalary(basics.salary)}`,
          size: 19,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: [
            basics.contacts.email,
            basics.contacts.telegram ? `Telegram @${basics.contacts.telegram}` : '',
            basics.contacts.github,
          ]
            .filter(Boolean)
            .join(' · '),
          size: 19,
        }),
      ],
    }),

    heading('О себе'),
    body(basics.summary),

    heading('Ключевые навыки'),
    body(flatSkills(resume).join(', ')),

    heading('Опыт работы'),
  ]

  for (const job of resume.experience) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [new TextRun({ text: formatPeriod(job.from, job.to), bold: true, size: 21 })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: job.legalName
              ? `${job.company} (${job.legalName}) — ${job.position}`
              : `${job.company} — ${job.position}`,
            bold: true,
            size: 21,
          }),
        ],
      }),
      body(job.summary),
      ...job.achievements.map((achievement) => bullet(achievement)),
    )

    if (job.stack.length > 0) {
      children.push(body(`Стек: ${job.stack.join(', ')}`))
    }
  }

  children.push(heading('Проекты'))

  for (const project of resume.projects) {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [
          new TextRun({
            text: `${project.name} (${project.period}) — ${project.role}`,
            bold: true,
            size: 21,
          }),
        ],
      }),
      body(`${project.tagline}. ${project.summary}`),
      ...project.results.map((result) => bullet(result)),
      body(`Стек: ${project.stack.join(', ')}`),
    )

    if (project.demo || project.code) {
      children.push(
        body(
          [project.demo ? `Сайт: ${project.demo}` : '', project.code ? `Код: ${project.code}` : '']
            .filter(Boolean)
            .join(' · '),
        ),
      )
    }
  }

  children.push(heading('Ранний опыт'))
  for (const item of resume.earlyExperience) {
    children.push(body(`${item.period} — ${item.text}`))
  }

  if (resume.education.length > 0) {
    children.push(heading('Образование'))
    for (const item of resume.education) {
      const parts = [
        item.institution,
        item.faculty,
        item.degree,
        item.year ? String(item.year) : '',
      ]
      children.push(body(parts.filter(Boolean).join(', ')))
    }
  }

  if (resume.languages.length > 0) {
    children.push(heading('Языки'))
    children.push(body(resume.languages.map((item) => `${item.name} — ${item.level}`).join(', ')))
  }

  children.push(
    new Paragraph({
      spacing: { before: 240 },
      children: [new TextRun({ text: `Обновлено: ${resume.meta.updated}`, size: 18 })],
    }),
  )

  const doc = new Document({
    creator: fullName(basics),
    title: resume.seo.title,
    description: resume.seo.description,
    sections: [{ properties: {}, children }],
  })

  const buffer = await Packer.toBuffer(doc)
  const outputDir = join(ROOT, 'public')
  await mkdir(outputDir, { recursive: true })
  const target = join(outputDir, DOCX_NAME)
  await writeFile(target, buffer)
  await publishToBuild(target)
  console.log(`DOCX: public/${DOCX_NAME}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
