import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Resume } from '../../shared/schema/resume'
import { parseResume } from '../../shared/utils/resume'

let cached: Resume | null = null

/** Читает и валидирует `data/resume.yaml` один раз за процесс сборки. */
export async function loadResume(): Promise<Resume> {
  if (cached) {
    return cached
  }

  const file = join(process.cwd(), 'data', 'resume.yaml')
  const raw = await readFile(file, 'utf8')
  cached = parseResume(raw)
  return cached
}
