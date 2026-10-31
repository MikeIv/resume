import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Resume } from '../shared/schema/resume'
import { parseResume } from '../shared/utils/resume'

/** Резюме из рабочего `data/resume.yaml` для тестов. */
export async function loadTestResume(): Promise<Resume> {
  const raw = await readFile(join(process.cwd(), 'data', 'resume.yaml'), 'utf8')
  return parseResume(raw)
}
