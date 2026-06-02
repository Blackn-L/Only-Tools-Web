# Security Policy

[Simplified Chinese](./SECURITY.zh-CN.md)

Please do not report security issues by posting real secrets in public issues,
pull requests, screenshots, or logs.

Before submitting an issue or pull request:

- Remove API keys, bearer tokens, cookies, and session IDs.
- Replace private domains, internal hostnames, and internal URLs with placeholders.
- Replace private image generation endpoints and sensitive prompts with placeholders.
- Do not attach `src/config/toolCatalog.local.ts`.
- Do not include browser localStorage dumps.
- Do not include request logs that contain Authorization headers.
- Do not attach generated images that contain private or sensitive information.

If this project is hosted on GitHub, use private vulnerability reporting when it
is available. Otherwise contact the maintainer privately before sharing sensitive
details.
