# Only Tools Web

Only Tools Web is an open-source, local-first Vue 3 tool navigator. It keeps
internal utilities and safe public links in one SPA, while leaving private
personal links in a gitignored local catalog.

Only Tools Web 是一个开源、本地优先的 Vue 3 工具导航站。它把内置工具和安全公开外链放在同一个 SPA 中，同时把个人私有链接留在被 Git 忽略的本地配置里。

## Features / 功能

- Tool directory with search, categories, featured tools, and internal routes.
- Public catalog for safe links that can be committed to the repository.
- Local private catalog for personal links that should never be committed.
- OpenAI-compatible API Key Tester with user-provided Base URL and model.
- No backend service and no telemetry.

- 支持搜索、分类、常用工具和内置工具路由的工具导航。
- 公开 catalog 只放可以提交到仓库的安全链接。
- 本地私有 catalog 用于个人链接，不应该提交。
- 通用 OpenAI-compatible API Key Tester，Base URL 和 model 都由用户输入。
- 无后端服务，无遥测。

## Quick Start / 快速开始

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

生产构建：

```bash
npm run build
npm run preview
```

## Add Public Tools / 添加公开工具

Add safe, non-private tools to `src/config/toolCatalog.public.ts`.

可以公开的工具放在 `src/config/toolCatalog.public.ts`。

```ts
{
  id: 'example-tool',
  name: 'Example Tool',
  description: 'A safe public tool.',
  categoryId: 'dev',
  tags: ['docs'],
  kind: 'external',
  url: 'https://example.com/',
}
```

## Add Private Local Tools / 添加本地私有工具

Copy `src/config/toolCatalog.local.example.ts` to
`src/config/toolCatalog.local.ts`, then edit it locally. The local catalog is
gitignored on purpose.

把 `src/config/toolCatalog.local.example.ts` 复制为
`src/config/toolCatalog.local.ts` 后在本机编辑。真实本地 catalog 已被 Git 忽略。

Do not commit private domains, tokens, internal dashboards, or personal service
URLs.

不要提交私有域名、token、内部看板或个人服务地址。

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
