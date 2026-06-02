# Only Tools Web

[Simplified Chinese](./README.zh-CN.md)

Only Tools Web is an open-source, local-first Vue 3 tool navigator. It groups
tools by category, supports Simplified Chinese and English in the app UI, and
keeps private personal links out of the public repository.

## Features

- Grouped tool directory with search and internal routes.
- Built-in OpenAI-compatible API Key Tester.
- Built-in OpenAI-compatible AI Image Generator with local browser settings.
- Simplified Chinese and English UI, with Simplified Chinese as the default.
- shadcn-vue components with Tailwind CSS.
- Public catalog for safe tools that can be committed.
- Gitignored local catalog for private personal tools.
- No backend service and no telemetry.

## Quick Start

```bash
pnpm install
pnpm run dev
```

Build for production:

```bash
pnpm run build
pnpm run preview
```

## Project Scripts

- `pnpm run dev`: start the Vite dev server.
- `pnpm run build`: type-check the app and build production assets.
- `pnpm run preview`: preview the latest production build.

Automated tests are not configured in this project. Use `pnpm run build` as the
required verification command before committing.

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for GitHub Pages, Vercel one-click
deployment, and independent server deployment with static file hosting.

## Add Public Tools

Add safe, non-private tools to `src/config/toolCatalog.public.ts`.

```ts
{
  id: 'example-tool',
  name: {
    zhCN: '<Simplified Chinese name>',
    enUS: 'Example Tool',
  },
  description: {
    zhCN: '<Simplified Chinese description>',
    enUS: 'A safe public tool.',
  },
  categoryId: 'productivity',
  tags: ['docs'],
  kind: 'external',
  url: 'https://example.com/',
}
```

Public tools must not include real API keys, private domains, internal service
names, or personal-only URLs.

## Add Private Local Tools

Copy `src/config/toolCatalog.local.example.ts` to
`src/config/toolCatalog.local.ts`, then edit it locally. The local catalog is
gitignored on purpose.

## Privacy

See [PRIVACY.md](./PRIVACY.md). In short: the app has no backend and no
telemetry. API keys are only used in the browser to call the endpoint you enter.

## Security

See [SECURITY.md](./SECURITY.md). Never paste real keys, private URLs, or
internal system details into public issues or pull requests.

## License

MIT
