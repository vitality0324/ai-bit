---
title: '用 Astro 搭建一个干净的静态站点'
description: '为什么我最终选择了 Astro，以及一个静态博客的项目结构应该长什么样。'
pubDate: 2026-09-12
tags: ['前端', 'Astro', '工程实践']
category: '工程'
cover: '/images/cover-4.svg'
---

选技术栈这件事，我的原则一向是：**让它尽可能简单，直到简单无法解决问题为止**。

## 为什么是 Astro

在几个候选方案里纠结了一阵之后，我选了 Astro，原因有几个：

- **默认零 JavaScript**。页面是纯 HTML，只有需要交互的地方才加载脚本。
- **内容即文件**。文章就是 Markdown 文件，用 Git 管理，天然有版本历史。
- **构建产物是静态的**。可以直接扔到 GitHub Pages、Cloudflare Pages 或任何 CDN 上。
- **岛屿架构**。哪天需要一个交互组件，可以单独把它"激活"，而不影响其他部分。

## 项目结构

一个维护起来舒服的结构大概是这样：

```text
.
├── src/
│   ├── components/      # 可复用组件
│   ├── content/
│   │   └── posts/       # ← 文章都放这里
│   ├── layouts/         # 页面骨架
│   ├── pages/           # 路由：文件路径 = URL
│   └── styles/          # 全局样式
├── public/              # 静态资源（图片、favicon）
└── astro.config.mjs
```

关键在于 `src/pages/` 的约定：**文件系统的路径就是 URL 路径**。

比如 `src/pages/about.astro` 对应 `/about`，`src/pages/posts/[...slug].astro` 则是一个动态路由，可以匹配 `/posts/任意文章名`。

## 动态路由是怎么工作的

这是 Astro 里最需要理解的一个概念。动态路由页面需要导出一个 `getStaticPaths` 函数，告诉构建器"有哪些页面需要生成"：

```ts
export async function getStaticPaths() {
  const posts = await getCollection('posts');

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

构建时，Astro 会为每篇文章调用一次这个页面模板，生成一个独立的 HTML 文件。**部署后没有运行时，只有文件**。

> 这就是静态站点快的根本原因：请求进来时，服务器不需要"计算"任何东西，只需要把已经存在的文件递出去。

## 关于样式的取舍

我刻意没有引入 UI 框架，而是用原生 CSS + 自定义属性（CSS Variables）来做设计系统：

```css
:root {
  --accent: #4f46e5;
  --radius: 14px;
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
}

.card {
  border-radius: var(--radius);
  transition: transform 0.45s var(--ease);
}
```

好处是：

- 没有构建期的样式处理负担
- 深色模式只需要覆盖一层变量
- 想调整视觉，改几个变量就够了

## 部署

如果是 GitHub Pages，加一个 workflow 就够了：

```yaml
- uses: actions/checkout@v4
- uses: withastro/action@v3
```

提交之后自动构建、自动发布。整个流程不需要我再操心。

## 小结

技术选型的本质是**约束管理**。每引入一个依赖，就多一份将来要维护的东西。

Astro 让我用很小的代价获得了一个又快又干净的站点。对个人博客来说，这已经足够了。
