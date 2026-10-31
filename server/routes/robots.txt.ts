export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const site = (config.public.siteUrl as string).replace(/\/?$/, '/')
  const atsPath = `${new URL(site).pathname.replace(/\/?$/, '/')}ats`

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${atsPath}`,
    `Sitemap: ${site}sitemap.xml`,
    '',
  ].join('\n')
})
