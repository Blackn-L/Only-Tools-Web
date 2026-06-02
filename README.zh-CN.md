# Only Tools Web

[English](./README.md)

<p align="center">
  开源、本地优先的开发者工具导航站。<br />
  分类整理 · API Key 测试 · AI 生图 · 国际化 · 零后端。
</p>

<p align="center">
  在线体验: <a href="https://only-tools-web.vercel.app/">Vercel</a>
  ·
  <a href="https://blackn-l.github.io/Only-Tools-Web/">GitHub Pages</a>
</p>

<p align="center">
  <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-16a34a?style=flat-square" />
</p>

---

## 功能概览

| 模块             | 能力                                                              |
| ---------------- | ----------------------------------------------------------------- |
| **工具目录**     | 按类别分组、关键词搜索、内置路由导航。                            |
| **API Key 测试** | 向任意自定义 API 端点发送测试请求，展示响应状态和延迟。           |
| **AI 生图**      | 通过自定义 API 端点文生图，配置保存在浏览器 localStorage。        |
| **双语界面**     | 支持简体中文和英文，运行时可切换，默认中文。                      |
| **公开 Catalog** | 安全工具提交至仓库，定义在 `src/config/toolCatalog.public.ts`。   |
| **本地 Catalog** | 私有工具定义在 `src/config/toolCatalog.local.ts`，已被 Git 忽略。 |
| **零后端**       | 纯前端应用，无遥测，所有数据留在浏览器本地。                      |

## 技术栈

| 类别          | 技术                      | 说明                                              |
| ------------- | ------------------------- | ------------------------------------------------- |
| **前端框架**  | Vue 3                     | Composition API、`<script setup>`、SFC 单文件组件 |
| **构建工具**  | Vite 8                    | 极速 HMR，基于 ESBuild                            |
| **包管理器**  | pnpm                      | 内容寻址存储，严格依赖隔离                        |
| **开发语言**  | TypeScript 6              | 严格模式，bundler 模块解析                        |
| **UI 组件库** | shadcn-vue + Reka UI      | 无头、可访问的原语组件，复制粘贴式使用            |
| **CSS 框架**  | Tailwind CSS 4            | 实用优先，Vite 原生插件                           |
| **状态管理**  | Pinia 3                   | 类型安全 Store，支持 DevTools                     |
| **路由管理**  | Vue Router 5              | History 模式，嵌套路由                            |
| **国际化**    | Vue I18n 11               | 消息函数，运行时语言切换                          |
| **图标库**    | Lucide Vue                | 统一风格 SVG 图标集                               |
| **工具库**    | VueUse 14                 | 浏览器 API、存储等组合式函数集                    |
| **样式辅助**  | CVA、clsx、tailwind-merge | 条件式 className 组合                             |

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 10+

### 安装与运行

```bash
git clone https://github.com/Blackn-L/Only-Tools-Web.git
cd Only-Tools-Web
pnpm install
pnpm run dev
```

在浏览器打开 `http://localhost:5173`。

### 生产构建

```bash
pnpm run build
pnpm run preview
```

### 常用脚本

| 命令               | 说明                                          |
| ------------------ | --------------------------------------------- |
| `pnpm run dev`     | 启动 Vite 开发服务器，支持 HMR。              |
| `pnpm run build`   | 使用 vue-tsc 进行类型检查，然后构建生产产物。 |
| `pnpm run preview` | 在本地预览生产构建。                          |

> 本项目当前不配置自动化测试。提交前必须运行 `pnpm run build` 作为验证。

## 项目结构

```text
src/
├── components/
│   ├── AppShell.vue               # 应用布局外壳
│   └── ui/                        # shadcn-vue 组件（button、dialog、input …）
├── config/
│   ├── toolCatalog.ts             # 合并 catalog 入口
│   ├── toolCatalog.public.ts      # 公开工具定义与分类
│   └── toolCatalog.local.example.ts
├── i18n/
│   ├── index.ts                   # Vue I18n 实例
│   ├── locales.ts                 # 语言定义
│   └── messages.ts                # 翻译消息
├── lib/
│   └── utils.ts                   # cn() className 合并辅助函数
├── router/
│   └── index.ts                   # Vue Router 路由配置
├── tools/
│   ├── image-generator/           # AI 生图工具
│   └── key-probe/                 # API Key 测试工具
├── types/
│   └── tools.ts                   # Tool 类型定义
├── views/
│   └── ToolHome.vue               # 主工具目录视图
├── App.vue                        # 根组件
├── main.ts                        # 应用入口
└── style.css                      # 全局样式 & Tailwind 引入
```

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

> 公开工具不能包含真实 API key、私有域名、内部服务名称或只属于个人的 URL。

## 添加本地私有工具

把 `src/config/toolCatalog.local.example.ts` 复制为 `src/config/toolCatalog.local.ts` 后在本机编辑。真实本地 catalog 已被 Git 忽略。

## 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Blackn-L/Only-Tools-Web)

详见 [DEPLOYMENT.zh-CN.md](./DEPLOYMENT.zh-CN.md)，其中包含 GitHub Pages、Vercel 一键部署和服务器独立静态部署说明。

## 隐私

详见 [PRIVACY.zh-CN.md](./PRIVACY.zh-CN.md)。简而言之：本项目没有后端和遥测，API key 只会在浏览器中用于请求你输入的 endpoint。

## 安全

详见 [SECURITY.zh-CN.md](./SECURITY.zh-CN.md)。不要在公开 issue 或 PR 中粘贴真实 key、私有 URL 或内部系统信息。

## 许可证

[MIT](./LICENSE)
