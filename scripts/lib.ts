import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import type { Resume } from '../shared/schema/resume'
import { parseResume } from '../shared/utils/resume'

export const ROOT = process.cwd()

/** Читает и валидирует `data/resume.yaml`. */
export async function readResume(): Promise<Resume> {
  const raw = await readFile(join(ROOT, 'data', 'resume.yaml'), 'utf8')
  return parseResume(raw)
}

/** Пишет файл, создавая каталоги по пути. */
export async function writeArtifact(relativePath: string, content: string): Promise<string> {
  const target = join(ROOT, relativePath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content, 'utf8')
  return target
}

/** Копирует готовый артефакт в собранную статику, если она уже существует. */
export async function publishToBuild(absolutePath: string): Promise<void> {
  const buildDir = join(ROOT, '.output', 'public')

  if (!existsSync(buildDir)) {
    return
  }

  await copyFile(absolutePath, join(buildDir, basename(absolutePath)))
}

/** Ждёт, пока сервер начнёт отвечать, но не дольше таймаута. */
export async function waitForServer(url: string, timeoutMs = 30_000): Promise<void> {
  const startedAt = Date.now()
  for (;;) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // сервер ещё поднимается
    }
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Сервер не ответил за ${timeoutMs} мс: ${url}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
}
