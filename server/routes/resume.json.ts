import { toJsonResume } from '../../shared/utils/exporters'

export default defineEventHandler(async (event) => {
  const resume = await loadResume()
  const site = useRuntimeConfig(event).public.siteUrl as string

  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return toJsonResume(resume, site)
})
