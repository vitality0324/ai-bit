<div align="center">

# AI Bit

**一个纯静态、易维护、排版精致的个人站点模板**

Astro · Markdown · 零后端 · 可直接部署到 GitHub Pages

</div>

---

## 这是什么

一个**纯静态**的个人博客 / 笔记站。构建后产出的是普通的 HTML / CSS / JS 文件，不需要服务器、不需要数据库，扔到任何静态托管上就能跑。

- ✍️ **写文章 = 新建一个 Markdown 文件**，不用碰任何代码
- 🎨 **设计系统基于 CSS 变量**，改几个变量就能换配色和圆角
- 🌗 **自动深色模式**，跟随系统，也可以手动切换（记忆在 localStorage）
- 🔍 **文章列表支持关键词搜索 + 标签筛选**（纯前端，零依赖）
- 📱 **完整响应式**，手机上体验同样干净
- ⚡ **默认零 JavaScript**，只有需要交互的地方才加载脚本
- 📡 自带 **RSS / sitemap / SEO meta / Open Graph** 分享图
- 🚀 **推送到 main 自动部署**，无需人工操作

---

## 快速开始

需要 Node.js 18 以上（推荐 20 或 22）。

```bash
npm install      # 安装依赖
npm run dev      # 本地预览 → http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

---

## 写一篇新文章

### 方式一：用命令生成（推荐）

```bash
npm run new -- "我的第一篇文章"
npm run new -- "RAG 实践笔记" --tags AI,工程实践
```

会在 `src/content/posts/` 下生成一个带好 frontmatter 的 `.md` 文件，并且默认 `draft: true`（本地可见、构建时不发布）。

### 方式二：手动新建

在 `src/content/posts/` 里新建一个 `.md` 文件即可：

```markdown
---
title: '我的第一篇文章'
description: '一句话摘要，会显示在列表卡片和搜索结果里。'
pubDate: 2026-10-09
tags: ['随笔', 'AI']
category: '随笔'
cover: '/images/cover-1.svg'
draft: false
featured: false
---

正文从这里开始，支持所有标准 Markdown 语法。
```

**文件名就是 URL**：`src/content/posts/my-post.md` → `/posts/my-post`

### Frontmatter 字段说明

| 字段 | 必填 | 类型 | 说明 |
| --- | :---: | --- | --- |
| `title` | ✅ | string | 文章标题 |
| `description` | | string | 摘要，用于列表卡片与 SEO 描述 |
| `pubDate` | ✅ | 日期 | 发布时间，如 `2026-10-09` |
| `updatedDate` | | 日期 | 更新时间，填了会在文章页显示"最后更新于…" |
| `tags` | | string[] | 标签，会自动生成标签页并出现在筛选器里 |
| `category` | | string | 分类（单值，可选） |
| `author` | | string | 作者，不填则用站点默认作者 |
| `cover` | | string | 封面图，可以是 `/images/xxx.svg` 或完整 https 链接 |
| `draft` | | boolean | `true` 时不出现在构建产物里（默认 `false`） |
| `featured` | | boolean | `true` 时会成为首页顶部的大卡片（默认 `false`） |

---

## 个性化配置

### 1. 站点信息 — `src/consts.ts`

站名、简介、作者、导航栏、社交链接、页脚版权年份，全部集中在这一个文件里：

```ts
export const SITE = {
  title: 'AI Bit',
  description: '记录关于 AI、工程与产品的思考碎片。',
  intro: '首页大标题下面那段介绍…',
  author: 'Zhang Xin',
  lang: 'zh-CN',
};

export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/tags', label: '标签' },
  { href: '/about', label: '关于' },
];
```

### 2. 配色与圆角 — `src/styles/global.css`

顶部 `:root` 里集中定义了所有设计变量，改这里就能整体换肤：

```css
:root {
  --accent: #4f46e5;   /* 主色 */
  --accent-2: #7c3aed; /* 渐变中间色 */
  --accent-3: #0ea5e9; /* 渐变结束色 */
  --radius-lg: 22px;   /* 大圆角 */
}
```

深色模式在 `:root[data-theme='dark']` 中单独覆盖。

### 3. 关于页 — `src/pages/about.astro`

关于页的内容直接写在文件里，顶部的 `focus` 和 `timeline` 两个数组改动即可。

### 4. 封面图

`public/images/` 下自带 6 张抽象渐变封面（SVG，体积很小且不会糊）。想换成自己的图片，把文件放进 `public/images/`，然后在 frontmatter 里写 `cover: '/images/你的图片.jpg'`。

> 想重新生成内置素材（favicon、封面、分享图）：`node scripts/gen-assets.mjs`

---

## 部署到 GitHub Pages

### 第一步：推到 GitHub

```bash
git init
git add -A
git commit -m "init"
git branch -M main
git remote add origin git@github.com:<你的用户名>/<仓库名>.git
git push -u origin main
```

### 第二步：打开 Pages

进入仓库 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**。

### 第三步：等它跑完

仓库里的 `.github/workflows/deploy.yml` 会在每次推送到 `main` 时自动构建并发布。默认会按 GitHub Pages 的规则自动推导站点地址：

| 仓库类型 | 地址 |
| --- | --- |
| 项目站 `用户名/任意仓库名` | `https://用户名.github.io/仓库名/` |
| 用户站 `用户名/用户名.github.io` | `https://用户名.github.io/` |

**通常不需要任何额外配置**，push 完等一两分钟就能访问了。

### 使用自定义域名 / 修改地址

如果要用自己的域名，在仓库 **Settings → Secrets and variables → Actions → Variables** 里新增两个变量：

| 变量名 | 值 | 例子 |
| --- | --- | --- |
| `SITE_URL` | 站点完整地址 | `https://blog.example.com` |
| `BASE_PATH` | 部署路径 | `/`（自定义域名用根路径） |

然后在你的域名服务商处把 CNAME 指向 `用户名.github.io`，并在仓库 Pages 设置里填上自定义域名（GitHub 会自动加上 HTTPS）。

> ⚠️ 改了 `SITE_URL` / `BASE_PATH` 之后记得重新推送一次以触发构建。

---

## 项目结构

```text
.
├── .github/workflows/deploy.yml   # 自动部署到 GitHub Pages
├── public/                        # 原样拷贝到 dist 的静态资源
│   ├── images/                    # 文章封面
│   ├── favicon.svg
│   └── og-default.png             # 社交分享默认图
├── scripts/
│   ├── gen-assets.mjs             # 重新生成 favicon / 封面 / 分享图
│   └── new-post.mjs               # npm run new 的实现
└── src/
    ├── components/                # 可复用组件（页头、页脚、卡片、图标…）
    ├── content/posts/             # ⭐ 所有文章都在这里
    ├── layouts/BaseLayout.astro   # 全站页面骨架
    ├── lib/                       # 工具函数（日期、阅读时长、base 路径…）
    ├── pages/                     # 路由：文件路径 = URL
    │   ├── index.astro            # 首页
    │   ├── posts/                 # 文章列表 + 文章详情
    │   ├── tags/                  # 标签云 + 单标签页
    │   ├── about.astro
    │   ├── rss.xml.js
    │   └── robots.txt.ts
    ├── styles/global.css          # 设计系统与全站样式
    ├── consts.ts                  # ⭐ 站点配置
    └── content.config.ts          # 文章 frontmatter 的字段校验规则
```

---

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器，改文件自动刷新 |
| `npm run build` | 构建静态站点到 `dist/` |
| `npm run preview` | 本地预览构建产物 |
| `npm run check` | 类型与语法检查 |
| `npm run new -- "标题"` | 新建一篇文章 |
| `node scripts/gen-assets.mjs` | 重新生成 favicon / 封面 / 分享图 |

---

## 技术说明

- **[Astro](https://astro.build/)** — 静态站点生成器，默认零 JS，构建产物是纯静态文件。
- **Content Collections + Zod** — frontmatter 写错字段会在构建时报错，而不是悄悄渲染出一个坏页面。
- **MDX 支持** — 如果某篇文章需要在正文里插入组件，把后缀从 `.md` 改成 `.mdx` 即可。
- **代码高亮** — 构建时用 Shiki 生成，深浅色各一套主题，页面里没有高亮脚本。
- **base 路径处理** — 所有站内链接都经过 `src/lib/url.ts` 的 `withBase()`，因此部署在子路径下也不会 404。

---

## 上线前的小检查

- [ ] 改掉 `src/consts.ts` 里的站名、作者与社交链接（目前是占位内容）
- [ ] 把示例文章 `src/content/posts/*.md` 替换成你自己的内容
- [ ] 在 GitHub 仓库 Pages 设置里把 Source 选为 **GitHub Actions**
- [ ] 按需添加一个 `LICENSE` 文件，明确别人可以怎么使用你的内容

---

<div align="center">
<sub>用 Astro 构建 · 用 Markdown 写作</sub>
</div>
