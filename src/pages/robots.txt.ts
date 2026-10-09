import type { APIRoute } from 'astro';

/** 根据 astro.config 里配置的 site / base 动态生成 robots.txt */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site ?? new URL('https://example.com');
  const sitemap = new URL(`${base}/sitemap-index.xml`, origin).href;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
