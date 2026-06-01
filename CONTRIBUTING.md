# Contributing / 贡献指南

## English

Thanks for helping improve Only Tools Web.

## Development

```bash
npm install
npm run dev
npm run build
```

## Pull Request Checklist

- Keep public tools safe to publish.
- Do not commit API keys, tokens, private URLs, or personal local catalog files.
- Put personal-only tools in `src/config/toolCatalog.local.ts`.
- Run `npm run build` before opening a pull request.
- Keep UI copy concise and utility-focused.

## Adding Tools

Public tools belong in `src/config/toolCatalog.public.ts`. Private personal
tools belong in `src/config/toolCatalog.local.ts`, which is intentionally
gitignored.

## 中文

感谢你帮助改进 Only Tools Web。

## 开发

```bash
npm install
npm run dev
npm run build
```

## PR 检查清单

- 确认公开工具可以安全发布。
- 不要提交 API key、token、私有 URL 或个人本地 catalog 文件。
- 只属于个人的工具放到 `src/config/toolCatalog.local.ts`。
- 提交 PR 前运行 `npm run build`。
- UI 文案保持简洁，优先服务实际操作。

## 添加工具

公开工具放在 `src/config/toolCatalog.public.ts`。个人私有工具放在
`src/config/toolCatalog.local.ts`，该文件会被 Git 忽略。
