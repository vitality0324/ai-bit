/**
 * 图标库：集中管理所有内联 SVG 图形片段。
 * 这里只保存 path / shape，外层 <svg> 由 Icon.astro 渲染。
 */

export type IconName =
  | 'github'
  | 'mail'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'search'
  | 'arrow-right'
  | 'arrow-left'
  | 'clock'
  | 'calendar'
  | 'rss'
  | 'tag'
  | 'chevron-up'
  | 'external'
  | 'sparkles';

/** 使用填充渲染的图标（其余为描边风格） */
export const FILLED_ICONS = new Set<IconName>(['github']);

export const ICON_PATHS: Record<IconName, string> = {
  github:
    '<path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>',
  mail:
    '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M3 6.5h18v11H3z"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="m3.5 7 8.5 6.2L20.5 7"/>',
  sun:
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.657-5.657 1.414-1.414M4.929 19.071l1.414-1.414m11.314 0 1.414 1.414M4.929 4.929l1.414 1.414"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  moon:
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/>',
  menu:
    '<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/>',
  close:
    '<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/>',
  search:
    '<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="m16 16 4 4"/>',
  'arrow-right':
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12h15m-6-6 6 6-6 6"/>',
  'arrow-left':
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20 12H5m6 6-6-6 6-6"/>',
  clock:
    '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M12 7.5V12l3 1.8"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M3.5 10h17M8 3v3.5M16 3v3.5"/>',
  rss:
    '<path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M5 18.5h.01M4.5 11.5a8 8 0 0 1 8 8M4.5 5.5a14 14 0 0 1 14 14"/>',
  tag:
    '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" d="M3.5 11.3V4.5a1 1 0 0 1 1-1h6.8a1 1 0 0 1 .7.3l8.2 8.2a1 1 0 0 1 0 1.4l-6.8 6.8a1 1 0 0 1-1.4 0l-8.2-8.2a1 1 0 0 1-.3-.7Z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/>',
  'chevron-up':
    '<path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="m6 14 6-6 6 6"/>',
  external:
    '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"/>',
  sparkles:
    '<path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M12 3.5 13.6 8l4.4 1.6L13.6 11 12 15.5 10.4 11 6 9.6 10.4 8 12 3.5ZM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
};;
