#!/usr/bin/env node
/**
 * 快速新建一篇文章：
 *   npm run new -- "文章标题"
 *   npm run new -- "文章标题" --tags AI,工程实践
 *
 * 会在 src/content/posts/ 下生成一个带 frontmatter 的 Markdown 文件。
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'src', 'content', 'posts');

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith('--'));

if (!title) {
  console.error('\n用法：npm run new -- "文章标题" [--tags AI,工程实践]\n');
  process.exit(1);
}

const tagsFlag = args.indexOf('--tags');
const tags =
  tagsFlag !== -1 && args[tagsFlag + 1]
    ? args[tagsFlag + 1].split(',').map((t) => t.trim()).filter(Boolean)
    : [];

/** 中文标题回退为日期 slug，英文标题转成 kebab-case */
function toSlug(text) {
  const ascii = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  if (ascii.replace(/-/g, '').length >= 2) return ascii;
  return `post-${new Date().toISOString().slice(0, 10)}`;
}

let slug = toSlug(title);
let file = path.join(postsDir, `${slug}.md`);
let i = 2;
while (await access(file).then(() => true, () => false)) {
  slug = `${toSlug(title)}-${i++}`;
  file = path.join(postsDir, `${slug}.md`);
}

const today = new Date().toISOString().slice(0, 10);
const tagLine = tags.length ? `\ntags: [${tags.map((t) => `'${t}'`).join(', ')}]` : '';

const template = `---
title: '${title.replace(/'/g, "\\'")}'
description: ''
pubDate: ${today}${tagLine}
draft: true
---

在这里开始写正文。

## 一个小标题

正文支持 **加粗**、\`行内代码\`、[链接](https://example.com) 等等。

\`\`\`js
console.log('hello');
\`\`\`
`;

await mkdir(postsDir, { recursive: true });
await writeFile(file, template);

console.log(`\n✅ 已创建：src/content/posts/${slug}.md`);
console.log('   draft 默认为 true（本地可见，构建时不发布）');
console.log('   写完后把 draft 改成 false 即可发布。\n');
