import { toHhPack } from '../shared/utils/exporters'
import { readResume, writeArtifact } from './lib'

/** Собирает markdown-пакет для ручного обновления профиля hh.ru. */
async function main(): Promise<void> {
  const resume = await readResume()
  const target = await writeArtifact('docs/hh-profile-pack.md', toHhPack(resume))
  console.log(`hh-пакет: ${target}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
