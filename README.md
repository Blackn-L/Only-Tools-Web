# Only Tools Web

Only Tools Web is an open-source, local-first Vue 3 tool navigator. It groups
tools by category, supports Simplified Chinese and English, and keeps private
personal links out of the public repository.

Only Tools Web 是一个开源、本地优先的 Vue 3 工具导航站。它按类别组织工具，支持简体中文和英文，并把个人私有链接留在公开仓库之外。

## Features / 功能

- Grouped tool directory with search and internal routes.
- Built-in OpenAI-compatible API Key Tester.
- Simplified Chinese and English UI, with Simplified Chinese as the default.
- shadcn-vue components with Tailwind CSS.
- Public catalog for safe tools that can be committed.
- Gitignored local catalog for private personal tools.
- No backend service and no telemetry.

- 按类别分组的工具目录，支持搜索和内置路由。
- 内置 OpenAI-compatible API Key Tester。
- 支持简体中文和英文界面，默认简体中文。
- 使用 shadcn-vue 组件和 Tailwind CSS。
- 公开 catalog 只放可以提交到仓库的安全工具。
- 被 Git 忽略的本地 catalog 用于个人私有工具。
- 无后端服务，无遥测。

## Quick Start / 快速开始

```bash
pnpm install
pnpm run dev
```

Build for production:

```bash
pnpm run build
pnpm run preview
```

生产构建：

```bash
pnpm run build
pnpm run preview
```

## Project Scripts / 项目脚本

- `pnpm run dev`: start the Vite dev server.
- `pnpm run build`: type-check the app and build production assets.
- `pnpm run preview`: preview the latest production build.

- `pnpm run dev`：启动 Vite 开发服务。
- `pnpm run build`：执行类型检查并生成生产构建。
- `pnpm run preview`：预览最新生产构建。

Automated tests are not configured in this project. Use `pnpm run build` as the
required verification command before committing.

本项目当前不配置自动化测试。提交前必须运行 `pnpm run build` 作为基础验证。

## Deployment / 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel one-click deployment and
independent server deployment with static file hosting.

详见 [DEPLOYMENT.md](./DEPLOYMENT.md)，其中包含 Vercel 一键部署和服务器独立静态部署说明。

## Add Public Tools / 添加公开工具

Add safe, non-private tools to `src/config/toolCatalog.public.ts`.

可以公开的工具放在 `src/config/toolCatalog.public.ts`。

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

Public tools must not include real API keys, private domains, internal service
names, or personal-only URLs.

公开工具不能包含真实 API key、私有域名、内部服务名称或只属于个人的 URL。

## Add Private Local Tools / 添加本地私有工具

Copy `src/config/toolCatalog.local.example.ts` to
`src/config/toolCatalog.local.ts`, then edit it locally. The local catalog is
gitignored on purpose.

把 `src/config/toolCatalog.local.example.ts` 复制为
`src/config/toolCatalog.local.ts` 后在本机编辑。真实本地 catalog 已被 Git 忽略。

## Privacy / 隐私

See [PRIVACY.md](./PRIVACY.md). In short: the app has no backend and no
telemetry. API keys are only used in the browser to call the endpoint you enter.

详见 [PRIVACY.md](./PRIVACY.md)。简而言之：本项目没有后端和遥测，API key 只会在浏览器中用于请求你输入的 endpoint。

## Security / 安全

See [SECURITY.md](./SECURITY.md). Never paste real keys, private URLs, or
internal system details into public issues or pull requests.

详见 [SECURITY.md](./SECURITY.md)。不要在公开 issue 或 PR 中粘贴真实 key、私有 URL 或内部系统信息。

## License / 许可证

MIT
