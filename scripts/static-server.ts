import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
}

/**
 * Минимальный статический сервер для снятия PDF со собранного сайта.
 * Нужен, чтобы Playwright открывал страницу по HTTP, а не по `file://`.
 */
export function startStaticServer(root: string, port: number): Promise<Server> {
  const base = normalize(root + sep)

  const server = createServer((request, response) => {
    const urlPath = decodeURIComponent((request.url ?? '/').split('?')[0] ?? '/')
    const target = normalize(join(base, urlPath))

    if (!target.startsWith(base)) {
      response.writeHead(403).end('forbidden')
      return
    }

    const filePath =
      existsSync(target) && statSync(target).isDirectory() ? join(target, 'index.html') : target

    if (!existsSync(filePath)) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('not found')
      return
    }

    response.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
    })
    createReadStream(filePath).pipe(response)
  })

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server))
  })
}

/** Останавливает сервер и рвёт открытые соединения. */
export function stopStaticServer(server: Server): void {
  server.closeAllConnections()
  server.close()
}
