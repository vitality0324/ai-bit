import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/** 过滤草稿并按时间倒序排列 */
export function sortPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => import.meta.env.DEV || !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );
}

/** 格式化日期：2024 年 5 月 1 日 */
export function formatDate(date: Date, style: 'long' | 'short' = 'long'): string {
  const d = new Date(date);
  if (style === 'short') {
    return d.toISOString().slice(0, 10);
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** 机器可读日期 */
export function isoDate(date: Date): string {
  return new Date(date).toISOString();
}

/**
 * 估算阅读时长。
 * 中文按 350 字/分钟，英文按 200 词/分钟。
 */
export function readingTime(text = ''): number {
  const plain = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~\-]/g, ' ');

  const cjk = (plain.match(/[\u4e00-\u9fa5\u3040-\u30ff]/g) || []).length;
  const words = (plain.replace(/[\u4e00-\u9fa5\u3040-\u30ff]/g, ' ').match(/[A-Za-z0-9'’\-]+/g) || [])
    .length;

  const minutes = cjk / 350 + words / 200;
  return Math.max(1, Math.round(minutes));
}

/** 把标签转成可用于 URL 的 slug */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '');
}

/** 统计所有标签及其文章数量 */
export function collectTags(posts: Post[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 简单的中文友好截断 */
export function excerpt(text = '', length = 120): string {
  const plain = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length)}…` : plain;
}
