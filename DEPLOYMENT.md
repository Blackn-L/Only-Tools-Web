# Deployment

[Simplified Chinese](./DEPLOYMENT.zh-CN.md)

Only Tools Web is a static Vue 3 SPA. It does not need a backend service,
database, scheduled job, or runtime secret.

## GitHub Pages

This repository includes `.github/workflows/deploy-pages.yml`.

Before the first deployment, open the repository settings on GitHub and set
Pages source to GitHub Actions. After that, every push to `main` builds and
deploys the site. Pull requests run the same build without deploying.

The workflow builds with:

```bash
VITE_BASE_PATH=/${repositoryName}/ pnpm run build
```

It also copies `dist/index.html` to `dist/404.html` so direct visits and
refreshes on SPA routes like `/tools/key-probe` can still load the app on
GitHub Pages.

## Vercel One-Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

Recommended Vercel settings:

- Framework Preset: `Vite`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `dist`
- Environment Variables: none required

The included `vercel.json` rewrites all routes to `index.html`, so direct visits
to routes like `/tools/key-probe` work correctly.

## Independent Server

Build the static files:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Upload or copy the generated `dist/` directory to your server, then serve it as
static files. The server must fall back unknown routes to `index.html`.

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

### Temporary Static Preview

For a quick server-side preview:

```bash
pnpm dlx sirv-cli dist --single --host 0.0.0.0 --port 4173
```

## Privacy Notes

- Do not deploy real API keys, tokens, private URLs, or local catalog files.
- Do not commit `src/config/toolCatalog.local.ts`.
- The app has no telemetry and no project-owned backend endpoint.
- API Key Tester calls only the endpoint entered in the browser.
