# Contributing / 贡献指南

## English

Thanks for helping improve Only Tools Web.

## Setup

```bash
npm install
npm run dev
npm run build
```

This project does not currently maintain automated tests. Run `npm run build`
before committing changes.

## Pull Request Checklist

- Keep public tools safe to publish.
- Do not commit API keys, tokens, private URLs, internal hostnames, or personal local catalog files.
- Put personal-only tools in `src/config/toolCatalog.local.ts`.
- Keep catalog names and descriptions bilingual.
- Run `npm run build` before opening a pull request.
- Keep UI copy concise and utility-focused.

## Adding Tools

Public tools belong in `src/config/toolCatalog.public.ts`. Private personal
tools belong in `src/config/toolCatalog.local.ts`, which is intentionally
gitignored.

Tool names and descriptions use this shape:

```ts
{
  zhCN: '中文文案',
  enUS: 'English copy',
}
```

## 中文

感谢你帮助改进 Only Tools Web。

## 开发

```bash
npm install
npm run dev
npm run build
```

本项目当前不维护自动化测试。提交前请运行 `npm run build`。

## PR 检查清单

- 确认公开工具可以安全发布。
- 不要提交 API key、token、私有 URL、内部主机名或个人本地 catalog 文件。
- 只属于个人的工具放到 `src/config/toolCatalog.local.ts`。
- catalog 的名称和描述需要同时提供中英文。
- 提交 PR 前运行 `npm run build`。
- UI 文案保持简洁，优先服务实际操作。

## 添加工具

公开工具放在 `src/config/toolCatalog.public.ts`。个人私有工具放在
`src/config/toolCatalog.local.ts`，该文件会被 Git 忽略。

工具名称和描述使用下面的结构：

```ts
{
  zhCN: '中文文案',
  enUS: 'English copy',
}
```
