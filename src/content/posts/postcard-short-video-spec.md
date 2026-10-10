---
title: '贴文卡（PostCard）短视频制作规范'
description: '基于 Remotion + React 的竖屏短视频模板规范：模拟社交媒体帖文截图的柔白卡片风格短视频制作指南。'
pubDate: 2026-08-24
cover: '/images/cover-6.svg'
tags: ['短视频', 'Remotion', 'React', 'PostCard', '贴文卡', '模板规范']
---
> 基于 Remotion + React 的竖屏短视频模板规范。
>
> - 中文名：**贴文卡**
> - 英文名：**PostCard**
>
> 「贴文卡」指**模拟社交媒体帖文截图，将柔白色卡片居中放置在纯黑动态渐变背景上的竖屏短视频**。

---

## 一、视频规格

| 项目 | 规范 |
| --- | --- |
| 分辨率 | **1080 × 1920**（9:16 竖屏） |
| 帧率 | **30 fps** |
| 时长 | **10 秒**（300 帧） |
| 编码 | H.264，CRF 18 |
| 格式 | `.mp4` |

---

## 二、画面结构

### 2.1 整体布局

- 背景：纯黑底色 + 三层半透明橙色圆形渐变缓慢浮动。
- 主体：一张柔白色卡片水平垂直居中，内部呈现帖文内容。
- 卡片内容从上到下依次为：头像/昵称/日期、正文、底部时间戳。

```
┌─────────────────────────────┐
│  [头像]  昵称                │
│          YYYY-MM-DD         │
│                             │
│  正文第 1 段（整段渲染，     │
│  浏览器按宽度自动换行）      │
│  ...                        │
│  正文第 N 段                 │
│                             │
│                    HH:MM    │
│                    星期X     │
└─────────────────────────────┘
```

### 2.2 默认账号信息

| 元素 | 默认值 |
| --- | --- |
| 头像 | `https://ai-bit.tech/brand/logo.png` |
| 昵称 | `高老师的分享局` |
| 头部日期 | 动态取当前日期，格式 `YYYY-MM-DD` |
| 底部时间戳 | 动态取当前时间，格式 `HH:MM` + 换行 + `星期X` |

---

## 三、画布与背景

### 3.1 画布规格

| 属性 | 值 |
| --- | --- |
| 宽度 | 1080px |
| 高度 | 1920px |
| 宽高比 | 9:16（竖屏） |
| 帧率 | 30fps |
| 时长 | 10 秒（300 帧） |

### 3.2 背景样式

- 底色：纯黑 `#000000`
- 动态效果：3 层半透明橙色圆形渐变，以不同速度和轨迹缓慢浮动
- 渐变颜色：`rgba(245,160,116, opacity)`
- 渐变尺寸：800px / 950px / 1100px
- 透明度：0.15 / 0.20 / 0.25

---

## 四、卡片规范

### 4.1 卡片外观

| 属性 | 值 |
| --- | --- |
| 背景色 | `#F5F3F0`（柔白） |
| 宽度 | 880px（固定） |
| 高度 | 由内容自动撑开 |
| 圆角 | 36px |
| 内边距 | 50px |
| 投影 | `0 8px 40px rgba(0,0,0,0.35)` |
| 定位 | 水平垂直居中（flexbox） |

### 4.2 头部（头像 + 昵称 + 日期）

| 属性 | 值 |
| --- | --- |
| 头像尺寸 | 80×80px |
| 头像形状 | 圆形（`borderRadius: 50%`） |
| 昵称字号 | 40px |
| 昵称字重 | 700 |
| 昵称颜色 | `#1A1A1A` |
| 日期字号 | 28px |
| 日期颜色 | `#999999` |
| 布局 | 头像在左，昵称+日期在右，垂直居中 |
| 与正文间距 | 44px |

### 4.3 正文

| 属性 | 值 |
| --- | --- |
| 字号 | 46px |
| 字重 | 700 |
| 颜色 | `#1A1A1A` |
| 行距 | 1.6 |
| 段间距 | 18px |
| 对齐 | 左对齐 |
| 高亮词颜色 | `#F5A074`（橙色） |
| 高亮词字重 | 800 |

正文内容由调用方传入，支持纯文本和高亮词混合。高亮词用 `<Hi>` 组件包裹。

正文排版（硬性要求）：

- **按段落整体渲染**：每个自然段渲染为一个整体块（`<p>`），段与段之间用段间距 **18px** 分隔（paragraph `margin-bottom: 18px`）。
- **浏览器自然换行**：段内文字由容器宽度自动折行，**禁止手动拆分行、禁止在文字内插入 `<br/>` 或 `\n` 控制断行**，不设置每行字数。
- 每个段落结尾必须有完整句号。

### 4.4 底部时间戳

| 属性 | 值 |
| --- | --- |
| 字号 | 24px |
| 颜色 | `#999999` |
| 对齐 | 右对齐 |
| 格式 | `HH:MM` + 换行 + `星期X` |
| 位置 | 卡片底部右下角，自动贴底 |

---

## 五、动画规范

- 全部文字在 **2 秒内** 淡入完毕
- 每段间隔 **5 帧**（约 0.17 秒）开始淡入
- 每段淡入时长 **9 帧**（0.3 秒）
- 动画以**段落**为最小单位（段落整体渲染为块，内部换行由浏览器自然排版，不按行拆分动画）
- 动画类型：纯 `opacity` 变化，无位移、无缩放
- `transformOrigin`：`left center`

时间线（帧）：

| 元素 | 开始帧 | 结束帧 |
| --- | --- | --- |
| 头部（头像+昵称+日期） | 0 | 9 |
| 正文第 1 段 | 6 | 15 |
| 正文第 2 段 | 11 | 20 |
| 正文第 3 段 | 16 | 25 |
| … | … | … |
| 正文第 N 段 | 6 + (N-1)*5 | 15 + (N-1)*5 |
| 底部时间戳 | 55 | 64 |

所有文字在第 60 帧（2 秒）内全部展示完毕。

---

## 六、色彩规范

| 用途 | 色值 | 说明 |
| --- | --- | --- |
| 背景底色 | `#000000` | 纯黑 |
| 渐变光效 | `rgba(245,160,116, 0.15~0.25)` | 橙色半透明 |
| 卡片背景 | `#F5F3F0` | 柔白，不刺眼 |
| 正文颜色 | `#1A1A1A` | 近黑 |
| 高亮词 | `#F5A074` | 橙色，与背景光效呼应 |
| 辅助文字 | `#999999` | 灰色（日期、时间戳） |

---

## 七、字体

```css
font-family: "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif;
```

---

## 八、从零搭建步骤

### 8.1 创建项目目录

```bash
mkdir postcard && cd postcard
```

### 8.2 创建 package.json

```json
{
  "name": "postcard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "studio": "remotion studio",
    "render": "remotion render PostCard out/video.mp4"
  },
  "dependencies": {
    "@remotion/cli": "4.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "remotion": "4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 8.3 创建 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### 8.4 创建 src/index.ts

```ts
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

### 8.5 创建 src/Root.tsx

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { PostCard } from './PostCard';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PostCard"
        component={PostCard}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
```

### 8.6 创建 src/PostCard.tsx

```tsx
import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from 'remotion';

const FONT = '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';
const CARD = '#F5F3F0';
const TEXT = '#1A1A1A';
const ORANGE = '#F5A074';
const GRAY = '#999999';

const NICKNAME = '高老师的分享局';

const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: ORANGE, fontWeight: 800 }}>{children}</span>
);

const now = new Date();
const DATE_STR = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
const TIME_STR = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const WEEKDAY = WEEKDAYS[now.getDay()];

// 正文按自然段落组织，每个元素是一段；段内换行交给浏览器自然排版，禁止手动分行
const paragraphs: React.ReactNode[] = [
  <>在经过了长期的思想斗争以后，现在正式不用 IDE 了，<Hi>Cursor</Hi> 也正式切换成了 <Hi>Agent View</Hi>，<Hi>VSCode</Hi> 也很少打开了。</>,
  <>代码只关注 <Hi>架构</Hi>，每次简单浏览 <Hi>Diff</Hi>，<Hi>Code Review</Hi> 交给多个 Agent 互相 review，验证就是完备的 E2E 了。</>,
  <>未来代码就是黑盒了，这是心酸但是没办法的事实了。</>,
];

export const PostCard: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = (start: number, dur = 9) =>
    interpolate(frame, [start, start + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {[0, 1, 2].map((i) => {
        const s = 0.15 + i * 0.08;
        const cx = 50 + Math.sin(frame * s * 0.03 + i * 2.1) * 25;
        const cy = 50 + Math.cos(frame * s * 0.025 + i * 1.7) * 30;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle ${800 + i * 150}px at ${cx}% ${cy}%, rgba(245,160,116,${0.15 + i * 0.05}), transparent 70%)`,
            }}
          />
        );
      })}

      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: 880, backgroundColor: CARD, borderRadius: 36, padding: 50, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 44, opacity: fade(0) }}>
            <Img src="https://ai-bit.tech/brand/logo.png" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ marginLeft: 18 }}>
              <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>{NICKNAME}</div>
              <div style={{ fontFamily: FONT, fontSize: 28, color: GRAY, lineHeight: 1.4 }}>{DATE_STR}</div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{ opacity: fade(6 + i * 5), fontFamily: FONT, fontSize: 46, fontWeight: 700, color: TEXT, lineHeight: 1.6, margin: '0 0 18px', transformOrigin: 'left center' }}>
                {p}
              </p>
            ))}
          </div>

          <div style={{ fontFamily: FONT, fontSize: 24, color: GRAY, marginTop: 'auto', paddingTop: 16, opacity: fade(55), textAlign: 'right' }}>
            {TIME_STR}<br />{WEEKDAY}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

### 8.7 安装依赖并渲染

```bash
npm install
npx remotion render PostCard out/video.mp4
```

Remotion 会自动检测系统中的浏览器。如需指定，添加 `--browser-executable=/path/to/chrome`。

输出文件：`out/video.mp4`

---

## 九、定制说明

制作新视频时，只需修改 `src/PostCard.tsx` 中的 `paragraphs` 数组，把新的正文按**自然段落**传入（一个元素对应一段，段尾有完整句号）。高亮词用 `<Hi>` 包裹。段内换行由浏览器按卡片宽度自然排版，**不要手动分行、不要设置每行字数**。

```tsx
const paragraphs: React.ReactNode[] = [
  <>第 1 段普通文字，浏览器自动折行。</>,
  <>第 2 段带 <Hi>高亮词</Hi> 的文字，同样整体渲染。</>,
  // ...
];
```

---

## 十、项目结构

```
postcard/
├── src/
│   ├── index.ts               # Remotion 入口
│   ├── Root.tsx               # 根组件
│   └── PostCard.tsx           # 贴文卡视频组件（核心）
├── package.json
├── tsconfig.json
└── out/
    └── video.mp4              # 渲染输出
```

---

*本文档作为 PostCard 贴文卡短视频模板的设计与开发规范，持续迭代中。*
