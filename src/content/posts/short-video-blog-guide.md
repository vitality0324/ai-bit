---
title: '「下海研究员」博客发布流程与规范'
description: 'short-video-blog 的新增文章、slug 命名、frontmatter 字段说明与 Vercel 自动部署完整流程。'
pubDate: 2026-08-24
cover: '/images/cover-3.svg'
tags: ['博客站', '规范', '部署']
---
# short-video-blog

下海研究员 — 短视频置顶评论的长文落地页，基于 [AstroPaper](https://github.com/satnaing/astro-paper)。

- 线上：<https://ai-bit.tech>
- 仓库：<https://github.com/addunt/short-video-blog>

## 本地开发

```bash
npm install
npm run dev
```

开发服务器可用后台模式管理：

```bash
astro dev --background
astro dev stop
astro dev status
astro dev logs
```

## 新增文章

在 `src/content/posts/` 新建 `{slug}.md`。

### Slug 命名

- 使用 **kebab-case**，全小写，用连字符分隔单词
- 示例：`qwen3-local-deploy.md`、`captionreel-short-video-spec.md`
- 避免和已有文章 slug 重复
- 建议与对应的 `videoSlug` 保持一致，方便后续关联

### Frontmatter

```yaml
---
author: AI Daily
pubDatetime: 2026-08-08
title: '文章标题'
description: '列表页摘要，控制在 2 行以内'
tags: ['Tag1', 'Tag2']
videoSlug: my-short-name      # 可选：对应短视频内部标识
sourceUrl: 'https://...'      # 可选：阅读原文或来源链接
videoUrl: 'https://...'       # 可选：短视频播放链接
---
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `author` | 是 | 固定为 `AI Daily` |
| `pubDatetime` | 是 | 发布日期，格式 `YYYY-MM-DD` |
| `title` | 是 | 文章标题 |
| `description` | 是 | 列表页摘要 |
| `tags` | 是 | 标签数组，建议 1-3 个，首字母大写 |
| `videoSlug` | 否 | 对应短视频项目内部标识 |
| `sourceUrl` | 否 | 阅读原文或外部来源链接 |
| `videoUrl` | 否 | 短视频播放地址 |

文章地址：`/p/{slug}/`（例如 `minimax-h3-guide.md` → `/p/minimax-h3-guide/`）

## 发布 Checklist（Agent 用）

1. 按规范创建 `src/content/posts/{slug}.md`
2. 本地构建验证：`npm run build`
3. 检查 Git 状态：`git status --short`
4. 确认提交账号后提交并推送（账号要求见下方「提交账号」）：

   ```bash
git add src/content/posts/{slug}.md
git commit -m "add post: 文章标题"
git push origin HEAD
```
5. 等待 Vercel 自动部署完成
6. 访问 `https://ai-bit.tech/posts/{slug}/` 验证线上页面

## 提交账号（重要）

推送前必须确认 Git committer 为 `Cursor Agent <cursoragent@cursor.com>`：

```bash
git config user.name   # 应输出 Cursor Agent
git config user.email  # 应输出 cursoragent@cursor.com
```

提交并推送：

```bash
git add src/content/posts/{slug}.md
git commit -m "add post: 文章标题"
git push origin HEAD
```

注意：用其他账号（如个人账号 addunt）推送，Vercel 部署会报错，无法触发线上更新；只有用 Cursor Agent 账号推送才能成功部署。提交账号需与历史提交保持一致。

## 部署

已连接 Vercel 项目 `short-video-blog`，推送 GitHub 后自动部署，或手动：

```bash
npm run build
vercel deploy --prod
```

## 定制保留

- `/p/{slug}/` 文章路径（兼容旧置顶链接）
- 文章页「观看短视频 / 阅读原文」按钮
- 顶部 / 文末广告位（`src/components/AdSlot.astro`）
- 亮暗主题、搜索、标签、RSS、sitemap
