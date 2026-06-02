# 隐私说明

[English](./PRIVACY.md)

Only Tools Web 按本地优先的静态 SPA 设计。

- 仓库中不包含后端服务。
- 仓库中不包含遥测、分析、追踪像素或远程日志。
- API Key Tester 只会请求用户自己输入的 Base URL。
- AI 生图工具只会请求用户自己输入的 Base URL。
- API key 不会发送给项目维护者，也不会发送到项目控制的服务器。
- API Key Tester 默认会把 key、endpoint、model、备注和并发设置存入本设备该浏览器的 localStorage。
- AI 生图工具默认会把 Base URL、API key、model、size 和 count 存入本设备该浏览器的 localStorage。
- AI 生图工具不会由本应用保存 prompt 或生成图片。
- 用户可以通过应用中的 Clear 操作清空本地 Key Tester 数据。
- 用户可以通过应用中的 Clear local data 操作清空本地 AI 生图数据。
- 当前界面语言会保存到 localStorage，key 为 `only-tools-web:locale`。
- 私有工具链接应放在 `src/config/toolCatalog.local.ts`，该文件已被 Git 忽略。

不要公开真实 API key、私有服务地址、内部看板链接、敏感 prompt、私有生成图片或个人本地 catalog 文件。
