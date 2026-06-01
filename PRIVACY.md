# Privacy Policy / 隐私说明

## English

Only Tools Web is designed as a local-first static SPA.

- No backend service is included in this repository.
- No telemetry, analytics, tracking pixel, or remote logging is included.
- The API Key Tester sends requests only to the Base URL that the user enters.
- API keys are not sent to this project owner or to any project-controlled server.
- Keys stay in memory by default.
- If the user enables "Remember locally", keys are stored in this browser's localStorage on this device.
- Users can clear local Key Tester data from the app with the Clear action.
- The selected UI language is stored in localStorage under `only-tools-web:locale`.
- Private tool links should be kept in `src/config/toolCatalog.local.ts`, which is gitignored.

Do not publish real API keys, private service URLs, internal dashboard links, or
personal local catalog files.

## 中文

Only Tools Web 按本地优先的静态 SPA 设计。

- 仓库中不包含后端服务。
- 仓库中不包含遥测、分析、追踪像素或远程日志。
- API Key Tester 只会请求用户自己输入的 Base URL。
- API key 不会发送给项目维护者，也不会发送到项目控制的服务器。
- 默认情况下，key 只保存在当前浏览器内存中。
- 如果用户开启 "Remember locally"，key 会存入本设备该浏览器的 localStorage。
- 用户可以通过应用中的 Clear 操作清空本地 Key Tester 数据。
- 当前界面语言会保存到 localStorage，key 为 `only-tools-web:locale`。
- 私有工具链接应放在 `src/config/toolCatalog.local.ts`，该文件已被 Git 忽略。

不要公开真实 API key、私有服务地址、内部看板链接或个人本地 catalog 文件。
