# Contributing

[Simplified Chinese](./CONTRIBUTING.zh-CN.md)

Thanks for helping improve Only Tools Web.

## Setup

```bash
pnpm install
pnpm run dev
pnpm run build
```

This project uses pnpm as its only package manager. Do not commit
`package-lock.json` or `yarn.lock`.

This project does not currently maintain automated tests. Run `pnpm run build`
before committing changes.

## Pull Request Checklist

- Keep public tools safe to publish.
- Do not commit API keys, tokens, private URLs, internal hostnames, or personal local catalog files.
- Put personal-only tools in `src/config/toolCatalog.local.ts`.
- Keep catalog names and descriptions bilingual.
- Run `pnpm run build` before opening a pull request.
- Keep UI copy concise and utility-focused.

## Adding Tools

Public tools belong in `src/config/toolCatalog.public.ts`. Private personal
tools belong in `src/config/toolCatalog.local.ts`, which is intentionally
gitignored.

Tool names and descriptions use this shape:

```ts
{
  zhCN: '<Simplified Chinese copy>',
  enUS: 'English copy',
}
```
