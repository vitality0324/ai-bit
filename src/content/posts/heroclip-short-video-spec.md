---
title: '主片卡（HeroClip）短视频制作规范'
description: '基于 Remotion + React 的竖屏短视频模板规范：纯黑画布、顶部标题/副标题、居中横屏主片、视频卡右下角半透明品牌水印。'
pubDate: 2026-09-30
cover: '/images/cover-1.svg'
tags: ['短视频', 'Remotion', 'React', 'HeroClip', '主片卡', '模板规范']
---
> 基于 Remotion + React 的竖屏短视频模板规范。
>
> - 中文名：**主片卡**
> - 英文名：**HeroClip**
>
> 「主片卡」指**纯黑竖屏画布上，顶部放标题与副标题，中间居中铺满宽度的横屏主片（源片可自带硬烧中文字幕），并在视频卡右下角叠半透明「高老师的分享局」水印的短视频**。

---

## 一、视频规格

| 项目 | 规范 |
| --- | --- |
| 分辨率 | **1080 × 1920**（9:16 竖屏） |
| 帧率 | **30 fps** |
| 时长 | **跟随源片**（`durationInFrames` = 源片帧数，不写死上限） |
| 编码 | H.264，CRF 18 |
| 格式 | `.mp4` |

> Remotion Composition 的 `durationInFrames` / `fps` 与源片对齐即可；源片若非 30fps，渲染前统一转成 30fps，或按实际 fps 改 Composition。

---

## 二、职责边界

| 环节 | 谁负责 |
| --- | --- |
| 源片下载、ASR、翻译、硬烧中文字幕 | **本规范不覆盖**（另做或上游已备好） |
| 竖屏画布、标题/副标题、主片居中、品牌水印 | **Remotion（HeroClip）** |

硬性约定：

- 中文字幕由**源片自带硬烧**；Remotion **不**叠软字幕。
- 传入 `OffthreadVideo` 的文件应已是「可用的主片」（含或不含硬烧字幕均可，但规范默认期望已含中文字幕）。

---

## 三、画面结构

### 3.1 整体布局

- 背景：**纯黑** `#000000`（无橙色浮动渐变）。
- **左右安全区**：各 **50px**（与平台裁切/遮盖对齐；内容区宽 **980**）。
- **上方**：标题 + 橙色短分隔线 + 副标题（落在主片上方的留白区，底对齐靠近主片；标题区 `left/right` 均为安全区）。
- **中间**：主片视频卡——宽度 **980**，高度按源片宽高比缩放，**水平居中 + 垂直居中**。
- **水印**：贴在**视频卡内部右下角**（不是画布角落），半透明。

```
┌─────────────────────────────┐  1080
│ ░50░                   ░50░ │  ← 左右安全区
│     标题（可含橙色高亮词）    │
│           ──                │  ← 橙色短横分隔
│     ─ 副标题 ─              │
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │     主片（横屏）      │   │  ← 宽 980，高随比例
│   │                     │   │
│   │       [头像] 昵称    │   │  ← 视频卡右下，opacity 0.5
│   └─────────────────────┘   │
│                             │
└─────────────────────────────┘  1920
```

### 3.2 主片尺寸（推荐算法）

```ts
const CANVAS_W = 1080;
const CANVAS_H = 1920;
const SIDE_SAFE = 50; // 左右安全区
const CONTENT_W = CANVAS_W - SIDE_SAFE * 2; // 980

// 源片宽高比 sourceW / sourceH（例：1260×640）
const VIDEO_W = CONTENT_W;
const VIDEO_HEIGHT = Math.round(CONTENT_W * (sourceH / sourceW)); // 例 ≈ 498
const VIDEO_TOP = Math.round((CANVAS_H - VIDEO_HEIGHT) / 2);
const VIDEO_LEFT = SIDE_SAFE;
```

- 主片 `objectFit`：推荐 `fill` 铺满视频卡（源片已按目标比例预处理时）；若需保比例裁切可用 `cover`。
- 标题区与视频卡均不得侵入左右安全区；画布两侧留黑边是预期行为。

---

## 四、标题与副标题（视觉原则 + 推荐默认值）

原则：

1. **层级清晰**：标题更醒目（更大、更粗、更白）；副标题略小、略灰，作补充说明。
2. **高亮只点关键词**：标题里 1–2 个核心词用橙色加重，其余保持白。
3. **装饰克制**：标题与副标题之间一条短橙线；副标题两侧各一条短水平橙线（**不要**用圆点或竖线）。
4. **可按片微调**：字号、字重、间距以推荐值为起点，长标题可略缩字号，短标题可略放大。

### 4.1 推荐默认值

| 元素 | 推荐值 | 说明 |
| --- | --- | --- |
| 标题字号 | **56px** | 字重 700；高亮词 800 |
| 标题颜色 | `#FFFFFF` | 高亮 `#F5A074` |
| 标题行高 | 1.35 | `letterSpacing: 0.03em` |
| 标题 maxWidth | 980px（= 内容区宽） | 标题容器 `left/right: 50` |
| 标题阴影 | `0 2px 12px rgba(245,160,116,0.35), 0 1px 4px rgba(0,0,0,0.6)` | 可选 |
| 分隔线 | 宽 **72** × 高 **3** | `#F5A074`，圆角 2，opacity ≈ 0.9 |
| 分隔线与标题间距 | marginTop **20** | — |
| 副标题字号 | **44px** | 字重 600 |
| 副标题颜色 | `#E8E8E8` | — |
| 副标题两侧短横 | **24 × 3** | `#F5A074`，与文字 gap **14** |
| 副标题与分隔线间距 | marginTop **16** | — |
| 标题区底边距 | paddingBottom **48** | 贴近来自主片顶边 |

标题区容器：占满 `0 → VIDEO_TOP`，`flex` 列布局，`justifyContent: 'flex-end'`，水平居中。

### 4.2 标题片段示例

```tsx
const FONT =
  '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';
const ORANGE = '#F5A074';

{/* 标题：关键词橙色高亮 */}
<div
  style={{
    fontFamily: FONT,
    fontSize: 56,
    fontWeight: 700,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 1.35,
    letterSpacing: '0.03em',
    maxWidth: CONTENT_W,
    width: '100%',
    textShadow:
      '0 2px 12px rgba(245,160,116,0.35), 0 1px 4px rgba(0,0,0,0.6)',
  }}
>
  AI 时代，
  <span style={{ color: ORANGE, fontWeight: 800 }}>执行力</span>
  正在贬值
</div>

{/* 标题与副标题之间的短橙线 */}
<div
  style={{
    width: 72,
    height: 3,
    borderRadius: 2,
    backgroundColor: ORANGE,
    marginTop: 20,
    marginBottom: 4,
    opacity: 0.9,
    boxShadow: '0 0 10px rgba(245,160,116,0.45)',
  }}
/>

{/* 副标题：两侧短水平橙线 */}
<div
  style={{
    fontFamily: FONT,
    fontSize: 44,
    fontWeight: 600,
    color: '#E8E8E8',
    textAlign: 'center',
    lineHeight: 1.4,
    letterSpacing: '0.04em',
    marginTop: 16,
    maxWidth: CONTENT_W,
    width: '100%',
    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  }}
>
  <span
    style={{
      width: 24,
      height: 3,
      borderRadius: 2,
      backgroundColor: ORANGE,
      flexShrink: 0,
      boxShadow: '0 0 8px rgba(245,160,116,0.5)',
    }}
  />
  马斯克给年轻人的生存建议
  <span
    style={{
      width: 24,
      height: 3,
      borderRadius: 2,
      backgroundColor: ORANGE,
      flexShrink: 0,
      boxShadow: '0 0 8px rgba(245,160,116,0.5)',
    }}
  />
</div>
```

---

## 五、品牌水印（固定）

本模板**固定**使用「高老师的分享局」水印，不做成可配置多品牌。

| 属性 | 值 |
| --- | --- |
| 位置 | **视频卡内部**右下角（相对视频面板 `position: absolute`） |
| right / bottom | **28** / **22**（推荐） |
| 布局 | 横向：圆形头像 + 昵称，`gap: 10`，垂直居中 |
| 头像 | `https://ai-bit.tech/brand/logo.png`（项目内可 `staticFile('logo.png')`） |
| 头像尺寸 | **52×52**，`borderRadius: 50%` |
| 昵称 | **高老师的分享局** |
| 昵称字号 / 字重 | **28** / **700** |
| 昵称颜色 | `rgba(255,255,255,0.9)` |
| 整体透明度 | **0.5**（半透明，无深色胶囊底） |
| 禁止 | 深色 pill 背景、画布级角落定位（必须相对视频卡） |

### 5.1 水印片段示例

```tsx
const AVATAR_SIZE = 52;
const WATERMARK_RIGHT = 28;
const WATERMARK_BOTTOM = 22;
const NICKNAME_SIZE = 28;
const WATERMARK_OPACITY = 0.5;
const NICKNAME = '高老师的分享局';

<div
  style={{
    position: 'absolute',
    right: WATERMARK_RIGHT,
    bottom: WATERMARK_BOTTOM,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    opacity: WATERMARK_OPACITY,
  }}
>
  <Img
    src={staticFile('logo.png')}
    style={{
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: '50%',
      objectFit: 'cover',
      flexShrink: 0,
    }}
  />
  <div
    style={{
      fontFamily: FONT,
      fontSize: NICKNAME_SIZE,
      fontWeight: 700,
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      textShadow: '0 1px 2px rgba(0,0,0,0.35)',
    }}
  >
    {NICKNAME}
  </div>
</div>
```

---

## 六、色彩与字体

| 用途 | 色值 |
| --- | --- |
| 画布底色 | `#000000` |
| 标题白 | `#FFFFFF` |
| 副标题 | `#E8E8E8` |
| 品牌橙 / 高亮 / 装饰线 | `#F5A074` |

```css
font-family: "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif;
```

---

## 七、Composition 注册（关键片段）

```tsx
import React from 'react';
import { Composition } from 'remotion';
import { HeroClip } from './HeroClip';

// 时长跟随源片：用 ffprobe / Remotion 探测后填入
export const DURATION_IN_FRAMES = 1376; // 示例：约 45.9s @ 30fps
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroClip"
        component={HeroClip}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
```

---

## 八、主片卡组件骨架（关键片段）

将标题区、居中视频卡、水印组合成 `HeroClip.tsx`（逻辑示意，数值取推荐默认）：

```tsx
import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
} from 'remotion';

const FONT =
  '"Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif';
const ORANGE = '#F5A074';

const SIDE_SAFE = 50;
const CONTENT_W = 1080 - SIDE_SAFE * 2; // 980
const VIDEO_W = CONTENT_W;
const VIDEO_HEIGHT = Math.round(CONTENT_W * (640 / 1260)); // 按源片比例替换
const VIDEO_TOP = Math.round((1920 - VIDEO_HEIGHT) / 2);
const VIDEO_LEFT = SIDE_SAFE;

const TITLE = (
  <>
    AI 时代，
    <span style={{ color: ORANGE, fontWeight: 800 }}>执行力</span>
    正在贬值
  </>
);
const SUBTITLE = '马斯克给年轻人的生存建议';
const NICKNAME = '高老师的分享局';

export const HeroClip: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 标题区：见第四节片段 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: SIDE_SAFE,
          right: SIDE_SAFE,
          height: VIDEO_TOP,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 48,
          boxSizing: 'border-box',
        }}
      >
        {/* 标题 / 分隔线 / 副标题 —— 按 4.2 粘贴 */}
      </div>

      {/* 居中主片 + 水印 */}
      <div
        style={{
          position: 'absolute',
          top: VIDEO_TOP,
          left: VIDEO_LEFT,
          width: VIDEO_W,
          height: VIDEO_HEIGHT,
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}
      >
        <OffthreadVideo
          src={staticFile('source-zh-subs.mp4')}
          style={{
            width: VIDEO_W,
            height: VIDEO_HEIGHT,
            objectFit: 'fill',
          }}
        />
        {/* 水印 —— 按 5.1 粘贴，必须放在本视频卡 div 内 */}
      </div>
    </AbsoluteFill>
  );
};
```

---

## 九、项目结构与渲染

### 9.1 推荐结构

```
heroclip/
├── src/
│   ├── index.ts          # registerRoot
│   ├── Root.tsx          # Composition id="HeroClip"
│   └── HeroClip.tsx      # 主片卡核心
├── public/
│   ├── source-zh-subs.mp4   # 已硬烧中文字幕的主片
│   └── logo.png             # 品牌头像（可从 ai-bit.tech 拉取）
├── package.json
├── tsconfig.json
└── out/
    └── video.mp4
```

### 9.2 渲染命令

```bash
# 预览
npx remotion studio

# 成片
npx remotion render HeroClip out/video.mp4 --codec=h264 --crf=18

# 单帧预览（任选一帧）
npx remotion still HeroClip out/preview.png --frame=30
```

---

## 十、快速修改对照表

| 想改什么 | 改哪里 | 推荐默认 |
| --- | --- | --- |
| 标题 / 副标题文案 | `TITLE` / `SUBTITLE` | 按片填写 |
| 标题高亮词 | 标题内 `<span style={{ color: ORANGE }}>` | `#F5A074` |
| 标题 / 副标题字号 | `fontSize` | 56 / 44 |
| 主片文件 | `OffthreadVideo` `src` | `staticFile('…')` |
| 左右安全区 | `SIDE_SAFE` | **50**（内容宽 980） |
| 主片高度 / 顶边 / 左边 | `VIDEO_HEIGHT` / `VIDEO_TOP` / `VIDEO_LEFT` | 按源片比例算 |
| Composition 时长 | `durationInFrames` | 跟源片帧数 |
| 水印透明度 | `WATERMARK_OPACITY` | `0.5` |
| 水印边距 | `WATERMARK_RIGHT` / `BOTTOM` | 28 / 22 |

---

## 十一、注意事项

1. **字幕**：只认源片硬烧；不要在 HeroClip 里再叠一层软字幕，避免重影。
2. **左右安全区**：固定各 **50px**；标题与主片都不得画出该区，避免平台裁切/遮盖。
3. **水印坐标系**：相对**视频卡**定位；放到 `AbsoluteFill` 根上会漂到画布角落，错误。
4. **背景**：保持纯黑；不要加 PostCard 式橙色浮动渐变（本模板刻意区分）。
5. **副标题装饰**：只用短**水平**橙线；用户已否决圆点与竖线。
6. **时长**：每条片单独设 `durationInFrames`，不要写死 300 帧。
7. **中文字体**：渲染机需有 Noto Sans CJK / 苹方 / 微软雅黑之一，否则中文会缺字。

---

*本文档作为 HeroClip 主片卡短视频模板的设计与开发规范，持续迭代中。*
