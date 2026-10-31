const PAGES = [
  { path: '/', priority: '1.0' },
  { path: '/resume.json', priority: '0.9' },
  { path: '/resume.txt', priority: '0.8' },
  { path: '/llms.txt', priority: '0.6' },
  { path: '/Ivanov-Mikhail-Nuxt-Fullstack.pdf', priority: '0.9' },
] as const

export default defineEventHandler(async (event) => {
  const resume = await loadResume()
  const site = useRuntimeConfig(event).public.siteUrl as string

  const items = PAGES.map(
    (page) =>
      `  <url><loc>${site}${page.path.replace(/^\//, '')}</loc><lastmod>${resume.meta.updated}</lastmod><priority>${page.priority}</priority></url>`,
  ).join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items,
    '</urlset>',
    '',
  ].join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
