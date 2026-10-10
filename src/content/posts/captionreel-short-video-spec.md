---
title: '字卡影快闪短视频（CaptionReel）制作与排版布局规范'
description: '基于 Remotion + React 的竖屏短视频模板规范：上半部分文字卡、下半部分影像素材，节奏明快的字卡影快闪短视频制作指南。'
pubDate: 2026-08-21
tags: ['短视频', 'Remotion', 'React', 'CaptionReel', '字卡影', '模板规范']
---
> 基于 Remotion + React 的竖屏短视频模板规范。
>
> - 中文全称：**字卡影快闪短视频**
> - 中文简称：**字卡影**
> - 英文名：**CaptionReel**
>
> 「字卡影快闪短视频」指**上半部分是文字卡、下半部分是影像素材，节奏明快的竖屏短视频**。

---

## 一、视频规格

| 项目 | 规范 |
| --- | --- |
| 分辨率 | **1080 × 1920**（9:16 竖屏） |
| 帧率 | **30 fps** |
| 时长 | **8–15 秒**（推荐 10 秒） |
| 编码 | H.264，CRF 18 |
| 格式 | `.mp4` |

> 时长根据文案量和素材节奏灵活调整，不固定为 10 秒。

---

## 二、整体排版布局

### 2.1 核心原则

- **上半部分文字，下半部分媒体素材**（视频或图片均可）。
- 文字 + 素材作为一个整体，在画面中**垂直居中**。
- 不强制固定上下安全区，剩余空间自然成为安全区。

### 2.2 容器布局（CSS Flex）

```tsx
<div
  style={{
    height: '100%',
    padding: '0 100px',      // 左右边距各 100px
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 整体垂直居中
    alignItems: 'stretch',
  }}
>
  {/* 文字块 */}
  <div style={{ flexShrink: 0 }}>
    ...
  </div>

  {/* 媒体素材（视频或图片） */}
  <div
    style={{
      width: '100%',
      aspectRatio: '16 / 9', // 高度按 16:9 自动
      marginTop: 50,          // 文字与素材间距 50px
      overflow: 'hidden',
      borderRadius: 8,
      flexShrink: 0,
    }}
  >
    <OffthreadVideo ... />
    {/* 或 <Img ... /> */}
  </div>
</div>
```

### 2.3 边距与间距

| 项目 | 当前规范 |
| --- | --- |
| 左右边距 | **100px** |
| 文字与素材间距 | **50px** |
| 内容宽度 | `1080 - 100 - 100 = 880px` |
| 素材高度 | `880 / 16 * 9 = 495px` |

> 边距和间距可随时调整，改一个 CSS 值即可。

---

## 三、文字样式

### 3.1 字号规范

| 元素 | 字号 | 字重 | 颜色 |
| --- | --- | --- | --- |
| 标题 | **52px** | 800 | 纯白 `#FFFFFF` |
| 正文 | **44px** | 500 | 近白 `rgba(255,255,255,0.94)` |
| emoji | **44px** | - | 系统彩色 emoji |

### 3.2 标题样式

```tsx
<div
  style={{
    fontSize: 52,
    fontWeight: 800,
    letterSpacing: 2,
    lineHeight: 1.25,
    marginBottom: 16,
    color: '#FFFFFF',
  }}
>
  🎉谁说丐版 Mac 不能跑大模型？
</div>
```

### 3.3 分隔线

```tsx
<div
  style={{
    width: 64,
    height: 3,
    borderRadius: 2,
    marginBottom: 22,
    background: 'linear-gradient(90deg, #5E9CFF, transparent)',
  }}
/>
```

### 3.4 正文清单

```tsx
<div
  style={{
    fontSize: 44,
    fontWeight: 500,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.94)',
  }}
>
  <div>正文第 1 行</div>
  <div>正文第 2 行</div>
  ...
</div>
```

### 3.5 关键词高亮

统一用黄色加粗高亮：

```tsx
const HIGHLIGHT = '#F1C40F';

const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: HIGHLIGHT, fontWeight: 800 }}>
    {children}
  </span>
);

// 使用
<Hi>Qwen 3.8-27B</Hi>
<Hi>Token自由</Hi>
```

---

## 四、入场动画

### 4.1 动画节奏

- 所有文字在 **1 秒（30 帧）内**全部入场完成。
- 标题先出现，正文每行错开 4 帧依次淡入。
- 每行淡入持续 7 帧。
- 只保留文字淡入 + 轻微缩放，**不加闪屏、不加白闪、不加其他特效**。

### 4.2 动画代码

```tsx
const frame = useCurrentFrame();

const appear = (start: number): number =>
  interpolate(frame, [start, start + 7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// 标题
const titleOpacity = appear(0);
const titleScale = 0.95 + 0.05 * appear(0);

// 正文第 i 行
const lineAnim = (i: number): React.CSSProperties => {
  const s = appear(4 * (i + 1));
  return { opacity: s, transform: `scale(${0.95 + 0.05 * s})` };
};
```

### 4.3 应用方式

```tsx
<div style={{ ...lineAnim(0), transformOrigin: 'left center' }}>
  正文第 1 行
</div>
<div style={{ ...lineAnim(1), transformOrigin: 'left center' }}>
  正文第 2 行
</div>
```

---

## 五、媒体素材

### 5.1 素材类型

下半部分媒体素材可以是：

- **视频素材**（推荐 16:9 横屏）
- **图片素材**（推荐 16:9 横屏，或可被裁切的图片）

### 5.2 视频素材调用

```tsx
import { OffthreadVideo, staticFile } from 'remotion';

<OffthreadVideo
  src={staticFile('your-video.mp4')}
  muted
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
```

### 5.3 图片素材调用

```tsx
import { Img, staticFile } from 'remotion';

<Img
  src={staticFile('your-image.jpg')}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
```

### 5.4 素材容器

```tsx
<div
  style={{
    width: '100%',
    aspectRatio: '16 / 9',
    marginTop: 50,
    overflow: 'hidden',
    borderRadius: 8,
    flexShrink: 0,
  }}
>
  {/* 视频或图片 */}
</div>
```

---

## 六、完整组件代码示例

```tsx
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  interpolate,
  useCurrentFrame,
} from 'remotion';

const FONT_FAMILY = '"Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", sans-serif';
const EMOJI_FAMILY = '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';

const ACCENT = '#5E9CFF';
const HIGHLIGHT = '#F1C40F';

const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: HIGHLIGHT, fontWeight: 800 }}>
    {children}
  </span>
);

export const FlashVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const appear = (start: number): number =>
    interpolate(frame, [start, start + 7], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const titleOpacity = appear(0);
  const titleScale = 0.95 + 0.05 * appear(0);

  const lineAnim = (i: number): React.CSSProperties => {
    const s = appear(4 * (i + 1));
    return { opacity: s, transform: `scale(${0.95 + 0.05 * s})` };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#04050C' }}>
      {/* 背景 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 1100px 820px at 50% -180px, rgba(70,130,255,0.17), transparent 62%), linear-gradient(180deg, #05060F 0%, #0A0F24 55%, #060811 100%)',
        }}
      />

      {/* 内容容器 */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: '0 100px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {/* 文字块 */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 52,
              fontWeight: 800,
              letterSpacing: 2,
              lineHeight: 1.25,
              marginBottom: 16,
              opacity: titleOpacity,
              transform: `scale(${titleScale})`,
              transformOrigin: 'left center',
              color: '#FFFFFF',
            }}
          >
            🎉谁说丐版 Mac 不能跑大模型？
          </div>

          <div
            style={{
              width: 64,
              height: 3,
              borderRadius: 2,
              marginBottom: 22,
              background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
            }}
          />

          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 44,
              fontWeight: 500,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.94)',
            }}
          >
            <div style={{ ...lineAnim(0), transformOrigin: 'left center' }}>
              <Hi>16G 丐版 M1</Hi>部署<Hi>Qwen 3.8-27B</Hi>代码实测：
            </div>

            <div style={{ ...lineAnim(1), transformOrigin: 'left center' }}>
              不出意外，智商在线，名不虚传
            </div>

            <div style={{ ...lineAnim(2), transformOrigin: 'left center' }}>
              业内著名的<Hi>「鹈鹕骑自行车」</Hi>测试，质量效果达标 <span style={{ fontFamily: EMOJI_FAMILY, fontSize: 44, marginLeft: 4 }}>🚴‍♂️</span>
            </div>

            <div style={{ ...lineAnim(3), transformOrigin: 'left center' }}>
              虽然<Hi>Token</Hi>输出速度稍微慢了一点，但整体运行毫无毛病
            </div>

            <div style={{ ...lineAnim(4), transformOrigin: 'left center' }}>
              有<Hi>Mac</Hi>的朋友大胆部署，<Hi>Token自由</Hi>不是梦！
            </div>
          </div>
        </div>

        {/* 媒体素材 */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            marginTop: 50,
            overflow: 'hidden',
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          <OffthreadVideo
            src={staticFile('pelican_bike_loop_10s.mp4')}
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

---

## 七、项目结构与渲染

### 7.1 关键文件

```
/workspace/captionreel/        # 项目英文名 CaptionReel，中文名字卡影
├── src/
│   ├── index.ts               # Remotion 入口
│   ├── Root.tsx               # 根组件
│   └── FlashVideo.tsx         # 字卡影视频组件（核心）
├── public/
│   ├── *.mp4                  # 视频素材
│   └── *.jpg / *.png          # 图片素材
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

### 7.2 package.json 脚本

```json
{
  "name": "captionreel",
  "scripts": {
    "render": "remotion render src/index.ts FlashVideo out/video.mp4",
    "still": "remotion still src/index.ts"
  }
}
```

### 7.3 渲染命令

```bash
cd /workspace/captionreel

# 渲染最终视频
npm run render

# 或直接用 npx
npx remotion render src/index.ts FlashVideo out/video.mp4 --codec=h264 --crf=18

# 渲染单帧预览
npx remotion still src/index.ts FlashVideo out/preview.png --frame=60
```

---

## 八、快速修改对照表

| 想改什么 | 改哪里 | 参数 |
| --- | --- | --- |
| 左右边距 | 内容容器 `padding` | `'0 100px'` |
| 文字与素材间距 | 素材容器 `marginTop` | `50` |
| 标题字号 | 标题 `fontSize` | `52` |
| 正文字号 | 正文 `fontSize` | `44` |
| 高亮颜色 | `HIGHLIGHT` 常量 | `#F1C40F` |
| 分隔线颜色 | `ACCENT` 常量 | `#5E9CFF` |
| 入场节奏 | `appear` 函数 | `[start, start + 7]` |
| 视频素材 | `OffthreadVideo` 的 `src` | `staticFile('xxx.mp4')` |
| 图片素材 | `Img` 的 `src` | `staticFile('xxx.jpg')` |
| 视频时长 | `remotion.config.ts` 或 Root.tsx 的 `durationInFrames` | `300`（10 秒） |

---

## 九、注意事项

1. **不要用 `<Loop>` 包裹 `OffthreadVideo`**，会导致文字被素材覆盖。需要循环的素材请先用 ffmpeg 预处理，或直接准备足够时长的素材。
2. 文字块和素材容器都要加 `flexShrink: 0`，防止 flex 压缩导致布局异常。
3. 素材容器用 `aspectRatio: '16 / 9'`，宽度填满，高度自动。
4. 文字入场动画只保留淡入 + 轻微缩放，避免过多动效干扰阅读。
5. emoji 需要系统安装 `Noto Color Emoji` 字体，渲染前确认 `fc-list | grep -i color emoji` 有输出。

---

*本文档作为 CaptionReel 字卡影快闪短视频模板的设计与开发规范，持续迭代中。*
