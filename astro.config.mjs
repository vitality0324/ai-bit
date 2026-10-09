// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * 部署配置
 * ---------------------------------------------------------------
 * 本地预览 / 自定义域名：不需要设置任何环境变量，默认即可。
 * GitHub Pages 项目站（https://<用户名>.github.io/<仓库名>/）：
 *   在 GitHub 仓库 Settings → Secrets and variables → Actions → Variables 中添加：
 *     SITE_URL  = https://<用户名>.github.io
 *     BASE_PATH = /<仓库名>
 * 用户站（https://<用户名>.github.io/）则把 BASE_PATH 设为 / 或不设置。
 * ---------------------------------------------------------------
 */
const site = process.env.SITE_URL || 'https://example.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
