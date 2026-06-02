# 安全政策

[English](./SECURITY.md)

请不要在公开 issue、PR、截图或日志中粘贴真实密钥。

提交 issue 或 PR 前：

- 移除 API key、bearer token、cookie 和 session ID。
- 用占位符替换私有域名、内部主机名和内部 URL。
- 用占位符替换私有图片生成 endpoint 和敏感 prompt。
- 不要附带 `src/config/toolCatalog.local.ts`。
- 不要附带浏览器 localStorage 导出内容。
- 不要附带包含 Authorization header 的请求日志。
- 不要附带包含隐私或敏感信息的生成图片。

如果项目托管在 GitHub，优先使用 private vulnerability reporting。否则请先私下联系维护者，再共享敏感细节。
