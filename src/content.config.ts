import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章集合
 * 在 src/content/posts/ 下新增 .md / .mdx 文件即会自动出现在网站上。
 * 文件名（不含后缀）就是文章的 URL 地址：/posts/<文件名>
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    /** 标题 */
    title: z.string(),
    /** 摘要，显示在列表卡片与 SEO 描述 */
    description: z.string().default(''),
    /** 发布时间 */
    pubDate: z.coerce.date(),
    /** 更新时间（可选） */
    updatedDate: z.coerce.date().optional(),
    /** 标签，用于分类与筛选 */
    tags: z.array(z.string()).default([]),
    /** 分类（可选，单个） */
    category: z.string().optional(),
    /** 作者（可选，默认取站点作者） */
    author: z.string().optional(),
    /** 封面图：可以是 /images/xxx.jpg 或完整的 https 链接 */
    cover: z.string().optional(),
    /** 设为 true 则不在列表中出现（草稿） */
    draft: z.boolean().default(false),
    /** 设为 true 会出现在首页「精选」区域 */
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
