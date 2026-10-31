import { join } from 'node:path'
import { ROOT } from './lib'
import { startStaticServer } from './static-server'

const PORT = Number(process.env.PORT ?? 3000)

/** Раздаёт собранную статику — для локальной проверки результата `pnpm generate`. */
async function main(): Promise<void> {
  const server = await startStaticServer(join(ROOT, '.output', 'public'), PORT)
  console.log(`Превью: http://127.0.0.1:${PORT}/`)
  console.log('Остановить: Ctrl+C')

  const stop = (): void => {
    server.closeAllConnections()
    server.close(() => process.exit(0))
  }

  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
