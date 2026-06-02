# Privacy Policy

[Simplified Chinese](./PRIVACY.zh-CN.md)

Only Tools Web is designed as a local-first static SPA.

- No backend service is included in this repository.
- No telemetry, analytics, tracking pixel, or remote logging is included.
- The API Key Tester sends requests only to the Base URL that the user enters.
- The AI Image Generator sends requests only to the Base URL that the user enters.
- API keys are not sent to this project owner or to any project-controlled server.
- API Key Tester stores keys, endpoints, models, notes, and concurrency settings in this browser's localStorage by default.
- AI Image Generator stores Base URL, API key, model, size, and count in this browser's localStorage by default.
- AI Image Generator prompts and generated images are not stored by this app.
- Users can clear local Key Tester data from the app with the Clear action.
- Users can clear local AI Image Generator data from the app with the Clear local data action.
- The selected UI language is stored in localStorage under `only-tools-web:locale`.
- The selected theme mode is stored in localStorage under `only-tools-web:theme` unless system mode is used.
- Private tool links should be kept in `src/config/toolCatalog.local.ts`, which is gitignored.

Do not publish real API keys, private service URLs, internal dashboard links,
sensitive prompts, generated private images, or personal local catalog files.
