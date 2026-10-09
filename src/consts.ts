/**
 * 站点全局配置
 * 想改站名、简介、导航、社交链接，改这里就够了。
 */

export const SITE = {
  /** 站点标题 */
  title: 'AI Bit',
  /** 副标题 / 一句话简介 */
  description: '记录关于 AI、工程与产品的思考碎片。',
  /** 首页大标题下的一段介绍 */
  intro:
    '这里收集我在 AI 应用、软件工程与产品设计上的实践笔记。用碎片拼出完整的认知地图。',
  /** 作者名，显示在页脚与文章页 */
  author: 'Zhang Xin',
  /** 默认语言 */
  lang: 'zh-CN',
  /** 每页文章列表显示数量（暂用于首页「最新文章」） */
  homePostCount: 6,
} as const;

/** 顶部导航 */
export const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/tags', label: '标签' },
  { href: '/about', label: '关于' },
] as const;

/** 社交 / 外链，按需增删；留空的会自动隐藏 */
export const SOCIAL_LINKS = [
  { href: 'https://github.com/vitality0324', label: 'GitHub', icon: 'github' },
  {
    href: 'mailto:vitality0324@users.noreply.github.com',
    label: 'Email',
    icon: 'mail',
  },
] as const;

/** 页脚版权起始年份 */
export const COPYRIGHT_START_YEAR = 2024;
