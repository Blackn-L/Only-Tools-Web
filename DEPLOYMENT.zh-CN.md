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
- Environment Variables：不需要

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

## 隐私注意事项

- 不要部署真实 API key、token、私有 URL 或本地 catalog 文件。
- 不要提交 `src/config/toolCatalog.local.ts`。
- 应用没有遥测，也没有项目自带后端 endpoint。
- API Key Tester 只会请求浏览器里输入的 endpoint。
