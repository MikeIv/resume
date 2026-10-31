import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const PDF = 'Ivanov-Mikhail-Nuxt-Fullstack.pdf'
const REQUIRED = [
  'ИВАНОВ',
  'NUXT',
  'О СЕБЕ',
  'КЛЮЧЕВЫЕ НАВЫКИ',
  'ОПЫТ РАБОТЫ',
  'ПРОЕКТЫ',
  'РАННИЙ ОПЫТ',
  'ОБРАЗОВАНИЕ И ЯЗЫКИ',
  'mike@ivanov-post.ru',
]

async function main(): Promise<void> {
  const data = new Uint8Array(await readFile(join(process.cwd(), 'public', PDF)))
  const doc = await getDocument({ data }).promise

  const pages: string[] = []
  for (let index = 1; index <= doc.numPages; index += 1) {
    const page = await doc.getPage(index)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
    pages.push(text)
  }

  const all = pages.join('\n').toUpperCase()
  const missing = REQUIRED.filter((needle) => !all.includes(needle.toUpperCase()))

  console.log(`Страниц: ${doc.numPages}`)
  console.log(`Символов текста: ${pages.join('').length}`)
  console.log(`Проверки: ${REQUIRED.length - missing.length}/${REQUIRED.length}`)

  if (missing.length > 0) {
    console.error(`Нет в PDF: ${missing.join(', ')}`)
    process.exitCode = 1
    return
  }

  if (doc.numPages > 2) {
    console.error(`Слишком много страниц для ATS: ${doc.numPages}`)
    process.exitCode = 1
    return
  }

  console.log('PDF: текстовый слой на месте, разделы найдены')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
