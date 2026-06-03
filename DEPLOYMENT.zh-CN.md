# 部署

[English](./DEPLOYMENT.md)

Only Tools Web 是一个静态 Vue 3 SPA，不需要后端服务、数据库、定时任务或运行时密钥。

## GitHub Pages

仓库内置 `.github/workflows/deploy-pages.yml`。

首次部署前，需要在 GitHub 仓库设置中把 Pages source 设置为 GitHub Actions。之后每次 push 到
`main` 都会构建并部署站点。Pull request 会运行同样的构建，但不会部署。

工作流会使用下面的方式构建：

```bash
VITE_BASE_PATH=/${repositoryName}/ pnpm run build
```

它还会把 `dist/index.html` 复制为 `dist/404.html`，让 `/tools/key-probe`
这类 SPA 路由在 GitHub Pages 上刷新或直达时仍然能加载应用。

## Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

推荐的 Vercel 配置：

- Framework Preset：`Vite`
- Install Command：`pnpm install --frozen-lockfile`
- Build Command：`pnpm run build`
- Output Directory：`dist`
- Environment Variables：
  - `VITE_API_PROXY_URL`（可选）：用于 API 请求的 CORS 代理地址。详见下方 [CORS 代理](#cors-代理)。

仓库内置的 `vercel.json` 会把所有路由重写到 `index.html`，因此直接访问
`/tools/key-probe` 等 SPA 路由也能正常工作。

## 服务器独立部署

构建静态文件：

```bash
pnpm install --frozen-lockfile
pnpm run build
```

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

### 临时静态预览

用于服务器上的快速预览：

```bash
pnpm dlx sirv-cli dist --single --host 0.0.0.0 --port 4173
```

## CORS 代理

应用直接从浏览器调用外部 API（如 OpenAI 兼容端点）。如果目标 API 服务器未发送 `Access-Control-Allow-Origin` 头，浏览器会阻止请求。

将 `VITE_API_PROXY_URL` 设置为 CORS 代理地址，代理会接收编码后的目标 URL 作为查询参数。

**该值必须是完整的 URL**：以 `https://` 开头，并以携带目标地址的查询参数结尾（通常是 `?target=`）。像 `only-tools-web.blackn.workers.dev` 这样只填域名是无效的 —— 应用无法拼出合法的请求地址，key 测试会显示「代理地址配置无效 (VITE_API_PROXY_URL)」。可直接参考使用的地址：

```
VITE_API_PROXY_URL=https://only-tools-web.blackn.workers.dev?target=
```

### Cloudflare Worker（推荐）

创建一个 [Cloudflare Worker](https://workers.cloudflare.com/)，使用以下代码：

```javascript
export default {
  async fetch(request) {
    // CORS 预检：回显浏览器请求的头，确保 x-api-key、anthropic-version、
    // Authorization 等自定义头都被放行（通配符 "*" 不覆盖 Authorization）。
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            request.headers.get('Access-Control-Request-Headers') || '*',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    const url = new URL(request.url)
    const target = url.searchParams.get('target')
    if (!target) return new Response('Missing target parameter', { status: 400 })

    const response = await fetch(target, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })

    // 用 Headers#set（大小写不敏感）覆盖目标已返回的 Access-Control-Allow-Origin，
    // 而不是再追加一个，否则浏览器会因非法的 "*, *" 值而拒绝。
    const headers = new Headers(response.headers)
    headers.set('Access-Control-Allow-Origin', '*')
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  },
}
```

部署后设置环境变量（使用你自己的 Worker 域名，或下面的参考 Worker）：

```
VITE_API_PROXY_URL=https://your-worker.your-subdomain.workers.dev?target=
# 或使用共享的参考 Worker：
VITE_API_PROXY_URL=https://only-tools-web.blackn.workers.dev?target=
```

### 其他代理

任何 CORS 代理服务均可使用。示例：

```
VITE_API_PROXY_URL=https://corsproxy.io/?url=
VITE_API_PROXY_URL=https://api.allorigins.win/raw?url=
```

## 隐私注意事项

- 不要部署真实 API key、token、私有 URL 或本地 catalog 文件。
- 不要提交 `src/config/toolCatalog.local.ts`。
- 应用没有遥测，也没有项目自带后端 endpoint。
- API Key Tester 只会请求浏览器里输入的 endpoint。
