# Only Tools Web

[English](./README.md)

Only Tools Web 是一个开源、本地优先的 Vue 3 工具导航站。它按类别组织工具，应用界面支持简体中文和英文，并把个人私有链接留在公开仓库之外。

## 功能

- 按类别分组的工具目录，支持搜索和内置路由。
- 内置 OpenAI-compatible API Key Tester。
- 内置 OpenAI-compatible AI 生图工具，配置保存在本机浏览器。
- 支持简体中文和英文界面，默认简体中文。
- 使用 shadcn-vue 组件和 Tailwind CSS。
- 公开 catalog 只放可以提交到仓库的安全工具。
- 被 Git 忽略的本地 catalog 用于个人私有工具。
- 无后端服务，无遥测。

## 快速开始

```bash
pnpm install
pnpm run dev
```

生产构建：

```bash
pnpm run build
pnpm run preview
```

## 项目脚本

- `pnpm run dev`：启动 Vite 开发服务。
- `pnpm run build`：执行类型检查并生成生产构建。
- `pnpm run preview`：预览最新生产构建。

本项目当前不配置自动化测试。提交前必须运行 `pnpm run build` 作为基础验证。

## 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

详见 [DEPLOYMENT.zh-CN.md](./DEPLOYMENT.zh-CN.md)，其中包含 GitHub Pages、Vercel 一键部署和服务器独立静态部署说明。

## 添加公开工具

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

公开工具不能包含真实 API key、私有域名、内部服务名称或只属于个人的 URL。

## 添加本地私有工具

把 `src/config/toolCatalog.local.example.ts` 复制为
`src/config/toolCatalog.local.ts` 后在本机编辑。真实本地 catalog 已被 Git 忽略。

## 隐私

详见 [PRIVACY.zh-CN.md](./PRIVACY.zh-CN.md)。简而言之：本项目没有后端和遥测，API key 只会在浏览器中用于请求你输入的 endpoint。

## 安全

详见 [SECURITY.zh-CN.md](./SECURITY.zh-CN.md)。不要在公开 issue 或 PR 中粘贴真实 key、私有 URL 或内部系统信息。

## 许可证

MIT
