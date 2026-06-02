# Only Tools Web

[简体中文](./README.zh-CN.md)

<p align="center">
  Open-source, local-first tool navigator for developers.<br />
  Grouped tools · API key tester · AI image generator · i18n · zero backend.
</p>

<p align="center">
  <a href="https://only-tools-web.vercel.app/">Online Demo</a>
  ·
  <a href="https://github.com/Blackn-L/Only-Tools-Web">GitHub</a>
</p>

<p align="center">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-16a34a?style=flat-square" />
</p>

---

## Features

| Module | Capabilities |
|--------|-------------|
| **Tool Directory** | Grouped categories, keyword search, internal route navigation. |
| **API Key Tester** | Send test requests to any custom API endpoint, display response status and latency. |
| **AI Image Generator** | Text-to-image via custom API endpoint, settings stored in browser localStorage. |
| **Bilingual UI** | Simplified Chinese and English, switchable at runtime, Chinese as default. |
| **Public Catalog** | Safe tools committed to the repo at `src/config/toolCatalog.public.ts`. |
| **Local Catalog** | Private tools in `src/config/toolCatalog.local.ts`, gitignored by design. |
| **No Backend** | Pure frontend app, zero telemetry, all data stays in the browser. |

## Tech Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Framework** | Vue 3 | Composition API, `<script setup>`, SFC |
| **Build Tool** | Vite 8 | Lightning-fast HMR, ESBuild-powered |
| **Package Manager** | pnpm | Content-addressable storage, strict dependency isolation |
| **Language** | TypeScript 6 | Strict mode, bundler module resolution |
| **UI Components** | shadcn-vue + Reka UI | Headless, accessible primitives with copy-paste components |
| **CSS Framework** | Tailwind CSS 4 | Utility-first, Vite-native plugin |
| **State Management** | Pinia 3 | Type-safe stores, devtools support |
| **Routing** | Vue Router 5 | History mode, nested routes |
| **i18n** | Vue I18n 11 | Message functions, locale switching at runtime |
| **Icons** | Lucide Vue | Consistent SVG icon set |
| **Utilities** | VueUse 14 | Composables for browser APIs, storage, and more |
| **Style Helpers** | CVA, clsx, tailwind-merge | Conditional className composition |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install and Run

```bash
git clone https://github.com/Blackn-L/Only-Tools-Web.git
cd Only-Tools-Web
pnpm install
pnpm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
pnpm run build
pnpm run preview
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start Vite dev server with HMR. |
| `pnpm run build` | Type-check with vue-tsc, then build production assets. |
| `pnpm run preview` | Preview the production build locally. |

> Automated tests are not configured. Use `pnpm run build` as the required verification step before committing.

## Project Structure

```text
src/
├── components/
│   ├── AppShell.vue               # App layout shell
│   └── ui/                        # shadcn-vue components (button, dialog, input …)
├── config/
│   ├── toolCatalog.ts             # Merged catalog entry point
│   ├── toolCatalog.public.ts      # Public tool definitions & categories
│   └── toolCatalog.local.example.ts
├── i18n/
│   ├── index.ts                   # Vue I18n instance
│   ├── locales.ts                 # Locale definitions
│   └── messages.ts                # Translation messages
├── lib/
│   └── utils.ts                   # cn() helper for className merging
├── router/
│   └── index.ts                   # Vue Router routes
├── tools/
│   ├── image-generator/           # AI image generator tool
│   └── key-probe/                 # API key tester tool
├── types/
│   └── tools.ts                   # Tool item type definitions
├── views/
│   └── ToolHome.vue               # Main tool directory view
├── App.vue                        # Root component
├── main.ts                        # App entry point
└── style.css                      # Global styles & Tailwind imports
```

## Add Public Tools

Add safe, non-private tools to `src/config/toolCatalog.public.ts`.

```ts
{
  id: 'example-tool',
  name: {
    zhCN: '示例工具',
    enUS: 'Example Tool',
  },
  description: {
    zhCN: '可以安全公开的工具。',
    enUS: 'A safe public tool.',
  },
  categoryId: 'productivity',
  tags: ['docs'],
  kind: 'external',
  url: 'https://example.com/',
}
```

> Public tools must not include real API keys, private domains, internal service names, or personal-only URLs.

## Add Private Local Tools

Copy `src/config/toolCatalog.local.example.ts` to `src/config/toolCatalog.local.ts`, then edit it locally. The local catalog is gitignored on purpose.

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for GitHub Pages, Vercel one-click deployment, and independent server deployment with static file hosting.

## Privacy

See [PRIVACY.md](./PRIVACY.md). In short: the app has no backend and no telemetry. API keys are only used in the browser to call the endpoint you enter.

## Security

See [SECURITY.md](./SECURITY.md). Never paste real keys, private URLs, or internal system details into public issues or pull requests.

## License

[MIT](./LICENSE)
