import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { sortPosts } from '../lib/utils';

export async function GET(context) {
  const posts = sortPosts(await getCollection('posts'));
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    trailingSlash: true,
    customData: '<language>zh-cn</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${base}/posts/${post.id}/`,
      categories: post.data.tags,
      author: post.data.author ?? SITE.author,
    })),
  });
}
