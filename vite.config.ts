import path from 'node:path'
import { Readable } from 'node:stream'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'

// Keep in sync with the dev fallback in src/lib/openai.ts.
const DEV_PROXY_PREFIX = '/__api_proxy'

// Dev-only CORS proxy: forwards `/__api_proxy?target=<encoded-url>` to the real
// endpoint server-side, so the browser never makes the blocked cross-origin call.
function devApiProxy(): Plugin {
  return {
    name: 'dev-api-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith(DEV_PROXY_PREFIX)) return next()

        const target = new URL(req.url, 'http://localhost').searchParams.get('target')
        if (!target) {
          res.statusCode = 400
          res.end('Missing target parameter')
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', async () => {
          try {
            const headers = new Headers()
            for (const [name, value] of Object.entries(req.headers)) {
              if (value === undefined) continue
              const lower = name.toLowerCase()
              if (lower === 'host' || lower === 'connection' || lower === 'content-length') continue
              headers.set(name, Array.isArray(value) ? value.join(',') : value)
            }

            const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && chunks.length > 0
            const upstream = await fetch(target, {
              method: req.method,
              headers,
              body: hasBody ? Buffer.concat(chunks) : undefined,
            })

            res.statusCode = upstream.status
            upstream.headers.forEach((value, key) => {
              const lower = key.toLowerCase()
              if (lower === 'content-encoding' || lower === 'content-length' || lower === 'transfer-encoding') {
                return
              }
              res.setHeader(key, value)
            })

            if (upstream.body) {
              Readable.fromWeb(upstream.body as Parameters<typeof Readable.fromWeb>[0]).pipe(res)
            } else {
              res.end()
            }
          } catch (err) {
            res.statusCode = 502
            res.end(`Proxy error: ${(err as Error).message}`)
          }
        })
      })
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [vue(), tailwindcss(), devApiProxy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
