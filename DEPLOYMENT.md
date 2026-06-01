# Deployment / 部署

Only Tools Web is a static Vue 3 SPA. It does not need a backend service,
database, scheduled job, or runtime secret.

Only Tools Web 是一个静态 Vue 3 SPA，不需要后端服务、数据库、定时任务或运行时密钥。

## Vercel One-Click / Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

Recommended Vercel settings:

- Framework Preset: `Vite`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist`
- Environment Variables: none required

推荐的 Vercel 配置：

- Framework Preset：`Vite`
- Install Command：`pnpm install --frozen-lockfile`
- Build Command：`pnpm run build`
- Output Directory：`dist`
- Environment Variables：不需要

The included `vercel.json` rewrites all routes to `index.html`, so direct visits
to routes like `/tools/key-probe` work correctly.

仓库内置的 `vercel.json` 会把所有路由重写到 `index.html`，因此直接访问
`/tools/key-probe` 等 SPA 路由也能正常工作。

## Independent Server / 服务器独立部署

Build the static files:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

构建静态文件：

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Upload or copy the generated `dist/` directory to your server, then serve it as
static files. The server must fall back unknown routes to `index.html`.

把生成的 `dist/` 目录上传或复制到服务器，并作为静态文件托管。服务器需要把未知路由回退到
`index.html`。

### Nginx

```nginx
server {
  listen 80;
  server_name example.com;

  root /var/www/only-tools-web/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Caddy

```caddyfile
example.com {
  root * /var/www/only-tools-web/dist
  try_files {path} /index.html
  file_server
}
```

### Temporary Static Preview / 临时静态预览

For a quick server-side preview:

```bash
pnpm dlx sirv-cli dist --single --host 0.0.0.0 --port 4173
```

用于服务器上的快速预览：

```bash
pnpm dlx sirv-cli dist --single --host 0.0.0.0 --port 4173
```

## Privacy Notes / 隐私注意事项

- Do not deploy real API keys, tokens, private URLs, or local catalog files.
- Do not commit `src/config/toolCatalog.local.ts`.
- The app has no telemetry and no project-owned backend endpoint.
- API Key Tester calls only the endpoint entered in the browser.

- 不要部署真实 API key、token、私有 URL 或本地 catalog 文件。
- 不要提交 `src/config/toolCatalog.local.ts`。
- 应用没有遥测，也没有项目自带后端 endpoint。
- API Key Tester 只会请求浏览器里输入的 endpoint。
