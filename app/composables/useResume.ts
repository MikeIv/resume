import type { Resume } from '#shared/schema/resume'

/**
 * Единая точка получения резюме на страницах.
 * Отдаётся Nitro-роутом `/api/resume` и встраивается в payload при генерации сайта.
 */
export function useResume() {
  return useFetch<Resume>('/api/resume', { key: 'resume' })
}
