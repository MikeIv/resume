import { toPlainText } from '../../shared/utils/exporters'

export default defineEventHandler(async (event) => {
  const resume = await loadResume()

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return toPlainText(resume)
})
