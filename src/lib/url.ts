/**
 * 处理 Astro 的 base 路径。
 * 部署到 GitHub Pages 项目站（/仓库名/）时，所有内部链接都要带上 base。
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 给站内路径加上 base 前缀 */
export function withBase(path: string): string {
  if (!path || path === '/') return `${BASE}/` || '/';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** 去掉 base 前缀，得到用于判断「当前页」的相对路径 */
export function stripBase(pathname: string): string {
  const stripped = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const normalized = `/${stripped.replace(/^\/+/, '')}`;
  return normalized !== '/' ? normalized.replace(/\/+$/, '') : '/';
}

/** 当前路径是否命中某个导航项 */
export function isActive(current: string, href: string): boolean {
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}
