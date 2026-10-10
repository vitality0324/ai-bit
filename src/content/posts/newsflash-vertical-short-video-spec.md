---
title: '快讯风竖屏短视频（NewsFlash）制作与排版布局规范'
description: '基于 HyperFrames 的快讯风竖屏短视频模板规范：标题、副标题、素材卡、正文四层结构，浅色纸感配色与 GSAP 级联动效。'
pubDate: 2026-09-13
cover: '/images/cover-5.svg'
tags: ['短视频', 'HyperFrames', '模板规范']
---
> 基于 HyperFrames（单 HTML + GSAP 单条 paused 时间轴）的快讯风竖屏短视频模板规范。
>
> - 中文名：**快讯风竖屏短视频**
> - 英文名：**NewsFlash**
>
> 「快讯风竖屏短视频」指用**标题、副标题、视觉素材卡、正文分段**四层结构呈现单条快讯的竖屏短视频：无旁白、无 BGM，靠文字级联入场、素材正放倒放循环和待机氛围动效撑住节奏，适合把一条图文快讯在 10 秒左右讲完。

---

## 一、视频规格

| 项目 | 规范 |
| --- | --- |
| 分辨率 | **1080 × 1920**（9:16 竖屏） |
| 帧率 | **30 fps** |
| 时长 | **8–15 秒**（推荐 10 秒左右，按正文段数微调） |
| 格式 | `.mp4`（无音轨） |
| 技术栈 | HyperFrames：单 `index.html` + GSAP 单条 paused 时间轴 |

> 时长由素材节奏决定，不固定；`data-duration` 与最后一段动画结束点之间留 1–2 秒停留。

---

## 二、整体排版布局

### 2.1 核心原则

- 自上而下依次为：**标题 → 副标题 → 视觉素材卡 → 正文分段堆叠**。
- 文字 + 素材作为一个整体，在画面中**上下居中**（flex 纵向 + `justify-content: center`），不设死上下安全区，剩余空间自然成为安全区。
- 左右留边：内容区宽 **880px**，左右边距各 100px。
- 标题、副标题居中对齐；正文**左对齐**（信息栈阅读习惯，不用居中）。

### 2.2 画布与内容容器

```html
<div
  id="root"
  data-composition-id="main"
  data-width="1080"
  data-height="1920"
  data-duration="10.5"
  data-fps="30"
>
  <!-- 背景装饰层（z-index: 0） -->
  <!-- .frame 内容列（z-index: 1） -->
  <!-- .vignette 暗角层（z-index: 2） -->
</div>
``````css
#root {
  position: relative;
  width: 1080px;
  height: 1920px;
  overflow: hidden;
  background: var(--bg);
}
.frame {
  position: relative;
  z-index: 1;
  width: 880px;              /* --content-w */
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;   /* 整体上下居中 */
  text-align: center;
}
```

### 2.3 边距与间距

| 项目 | 当前规范 |
| --- | --- |
| 内容区宽 | `--content-w: 880px` |
| 左右边距 | 各 100px（(1080 − 880) / 2） |
| 标题 → 副标题 | 18px |
| 副标题 → 素材卡 | 40px |
| 素材卡 → 正文 | 44px |
| 正文行高 | 1.6 |

> 间距改一个 CSS 值即可。注意：**正文变长时，标题 + 副标题 + 素材卡 + 正文的四层总高很容易超过 1920px**——flex 居中会让整列向上下同时溢出，标题、副标题被顶出画面，看起来像「视频盖住了文字」。此时按 4.1 的优先级收间距、降字号或缩素材区，出片前量总高。

---

## 三、配色与字体

### 3.1 配色（浅色纸感）

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--bg` | `#f7f3ea` | 暖白纸感底色 |
| `--fg` | `#202634` | 标题主色 |
| `--fg-dim` | `#5c6470` | 副标题弱化色 |
| `--accent` | `#8f5e00` | 点缀强调色（token 强调、正文高亮），浅底上满足 WCAG AA |
| 正文色 | `#2c3240` | 正文 |
| `--card-border` | `rgba(143, 94, 0, 0.28)` | 素材卡描边 |

> `--accent` 按素材主色系选择**深色变体**（呼应素材的暖黄与红眼），必须在浅底上过对比度检查，禁止直接用素材本身的亮色。

### 3.2 背景装饰

浅底不靠深色撑氛围，靠三层低成本装饰：

```css
/* 柔焦暖色斑 ×2：右上金、左下橙 */
#blob-a { top: -280px; right: -260px;
  background: radial-gradient(circle, rgba(240, 205, 145, 0.55), transparent 68%); }
#blob-b { bottom: -300px; left: -280px;
  background: radial-gradient(circle, rgba(233, 178, 132, 0.4), transparent 68%); }

/* 两侧斜向金色细线，氛围循环中做透明度呼吸 */
#edge-a { top: 150px; left: -70px; transform: rotate(-33deg);
  background: linear-gradient(90deg, transparent, rgba(143, 107, 42, 0.85)); opacity: 0.28; }

/* 极浅暖色暗角，收拢视线 */
.vignette { background: radial-gradient(ellipse at 50% 46%, transparent 58%, rgba(120, 100, 60, 0.18) 100%); }
```

- 色斑、细线均为出血元素，必须加 `data-layout-allow-overflow`。
- 装饰层 `z-index: 0`，内容 `z-index: 1`，暗角 `z-index: 2` 且 `pointer-events: none`。

### 3.3 字体（内嵌 woff2，渲染确定性）

```css
@font-face {
  font-family: "Noto Sans CJK SC";
  src: url("assets/fonts/NotoSansCJKsc-Bold.woff2") format("woff2");
  font-weight: 100 700;
}
@font-face {
  font-family: "Noto Sans CJK SC";
  src: url("assets/fonts/NotoSansCJKsc-Black.woff2") format("woff2");
  font-weight: 701 900;
}
```

- 用 fontTools 从系统 ttc 抽取 SC 字族生成 woff2，随项目内嵌（`assets/fonts/`），**禁止依赖渲染机系统字体**。
- Bold 档覆盖 100–700，Black 档覆盖 701–900；标题用 900，正文用 700，副标题用 500。

---

## 四、文字层规范

### 4.1 字号规范

| 元素 | 字号 | 字重 | 颜色 |
| --- | --- | --- | --- |
| 标题 | **68px** | 900 | `--fg`，强调 token 用 `--accent` |
| 副标题 | **44px** | 500 | `--fg-dim` |
| 正文 | **37px** | 700 | `#2c3240`，关键词用 `--accent` |

> **上表是按短文案基准（正文 5 段、约 120 字）标定的参考值，不是万能默认值。** 标题 68 + 副标题 44 + 16:9 素材卡（约 495px）+ 正文 + 各段间距相加，正文一长总高就会超过 1920px：`justify-content: center` 下整列上下同时溢出，标题、副标题被顶出画面，看起来像「视频盖住了文字」。
>
> 正文变长时按以下优先级压缩：
>
> 1. 收紧间距：段间距（4.4 的 `p + p`）与 2.3 的三个层间距；
> 2. 降正文字号：±2px 步进，以手机端可读为下限；
> 3. 缩小素材区：调低 `aspect-ratio` 高度或收窄素材卡。
>
> **出片前必须量总高**：用 `npx hyperframes snapshot` 自检首尾帧，确认标题、副标题、末段正文完整在画面内，总高超界就回到上一步继续压，再进渲染。

### 4.2 标题 token 化

标题按词拆成 `.tk`（inline-block + 初始 opacity 0），供级联入场；其中 1–2 个核心词用 `.tk-ac` 上强调色：

```html
<h1 id="title"
  ><span class="tk" id="tk1">果蝇大脑</span> <span class="tk tk-ac" id="tk2">VS</span>
  <span class="tk" id="tk3">主流</span> <span class="tk tk-ac" id="tk4">LLM</span></h1
>
``````css
.tk { display: inline-block; opacity: 0; will-change: transform; }
.tk-ac { color: var(--accent); }
```

### 4.3 副标题

一行完整句，概括视频看点，不与正文重复：

```css
#subtitle {
  margin: 18px 0 0;
  font-size: 44px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--fg-dim);
  opacity: 0;   /* 交给时间轴入场 */
}
```

### 4.4 正文分段堆叠

正文按用户原文的**自然段落**分块：一个段落一个 `<p>`，左对齐，关键词用 `.hl` 高亮；段内换行交给浏览器在 880px 内容区内自然折行，**禁止手动断行**：

```html
<div id="body-paras">
  <p>果蝇大脑和我们今天用的主流 LLM，结构上有巨大区别。</p>
  <p>人类设计的神经网络，在训练前，都是固定好了结构（Transformer，MoE，Dense），再通过数据调整权重。</p>
  <p>只有<span class="hl">16.7 万</span>个神经元，粗暴类比成 AI 模型，它大概是一个 <span class="hl">0.026B</span> 级别的超稀疏连接网络。</p>
  <p>现在都有人拿它来玩游戏、开车、刷视频、解魔方。</p>
  <p>这种网络如果让人设计，一根线一根线设计，<span class="hl">完全不可能</span>。</p>
</div>
``````css
#body-paras { margin: 0; text-align: left; }
#body-paras p {
  font-size: 37px;          /* 基准值；正文变长时按 4.1 下调 */
  font-weight: 700;
  line-height: 1.6;
  color: #2c3240;
  opacity: 0;               /* 交给时间轴按段入场 */
  will-change: transform;
}
#body-paras p + p { margin-top: 22px; }   /* 段间距，长正文时优先收紧这里 */
.hl { font-style: normal; color: var(--accent); }
```

文案规则：

1. **零改写**：不增删改写用户文案，只做排版级处理。
2. **保留原段落 + 自然换行**：一个自然段一个 `<p>`，段内由浏览器自然折行；**禁止按标点手动拆行**——那是排版改写，会产生大量半行，且与自然阅读习惯冲突。
3. 每段**段尾标点完整**，句号不能丢。
4. 每段高亮 0–1 处，全片高亮总量收敛在关键数字与结论（如 `16.7 万`、`0.026B`），结尾金句重点高亮。

---

## 五、素材层规范

### 5.1 素材卡

- **宽度固定**：撑满内容区（880px）。
- **宽高比与素材一致，高度第 0 帧锁死**：卡片用 `aspect-ratio` 声明素材真实比例，宽度 880px 下高度从第 0 帧即由比值确定（16:9 素材 → 495px），**不依赖视频元数据撑开**；比例特殊的素材直接写死像素高度。换素材时只改这一处比值。
- `object-fit: cover`：比例声明正确时不裁切，素材实际比例异常时兜底防黑边。
- 圆角 20px，1.5px 描边，浅卡底 `#fdfbf5`；素材本身深底时呈「相框式」对比。
- **入场不动布局**：素材区高度第 0 帧即参与布局，视频晚到或入场动效都不会引起整列重排（因此素材卡入场禁止位移，见 6.1）。

```css
.media-wrap { position: relative; margin: 40px 0 44px; opacity: 0; }
.card-glow {
  position: absolute; inset: -34px;
  background: radial-gradient(closest-side, rgba(230, 170, 80, 0.5), transparent 72%);
  opacity: 0.26;
}
.card-float { position: relative; z-index: 1; }
.media-card {
  overflow: hidden;
  border-radius: 20px;
  border: 1.5px solid var(--card-border);
  background: #fdfbf5;
}
.media-card video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;   /* 与素材一致，高度第 0 帧锁死（880×9÷16=495px） */
  object-fit: cover;
}
```

辉光层（`.card-glow`）与浮动层（`.card-float`）分离：辉光在待机氛围中呼吸，浮动层做整体 ±6px 漂移。

### 5.2 视频播放模型（先 ffmpeg 预编码，合成内线性播放）

源素材统一预编码为「**2 倍速 + 正放倒放无缝循环**」片段：

```bash
# 1) 2 倍速 + 正放倒放无缝循环（7.5s 源 → 7.5s 循环体）
ffmpeg -i source.mp4 -filter_complex \
  "[0:v]setpts=PTS/2[v];[v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[out]" \
  -map "[out]" -an loop.mp4

# 2) 循环体不够铺满合成时长时，流拷贝拼接（7.5s → 15.1s）
ffmpeg -stream_loop 3 -i loop.mp4 -c copy loop2.mp4
```

合成内以 **1 倍速线性播放**：

```html
<video
  id="fly-loop"
  src="assets/loop2.mp4"
  data-start="0.8"
  data-duration="9.7"
  muted
  playsinline
></video>
```

规则：

1. **禁用 `playbackRate`**：变速在 ffmpeg 阶段完成，保证预览与渲染严格一致。
2. `muted` + `playsinline`，不带 `crossorigin`。
3. `data-start` / `data-duration` **只写在 video 元素上**，父级不得再出现 `data-start`。
4. 素材进入画面的时刻（`data-start`）与素材卡入场动效（0.85s）对齐。

---

## 六、动效规范

### 6.1 原则

- **GSAP 单条 paused 时间轴**，挂到 `window.__timelines["main"]`，整条时间轴 seek 安全、确定性渲染。
- 文字类动效只保留「淡入 + 轻位移」，信息栈式堆叠、出现后**保留**（不做淡出）。
- **素材卡入场只做「淡入 + 轻缩放」，禁止 y/x 位移**：素材区高度已锁死（5.1），任何位移都会带来基准位跳动感，且无布局意义。
- 待机氛围动效必须是**纯时间函数**（sin 呼吸），禁止随机数与真实时钟。
- 速度感来自入场节奏（power4.out 快出缓收），不靠弹跳堆料。

### 6.2 时间轴常量与节拍表

```js
var F = 1 / 60;            // 单帧时长
var T_TITLE = 0.1;         // 标题级联起点
var T_SUBTITLE = 0.72;     // 副标题起点
var T_CARD = 0.85;         // 素材卡入场
var T_BODY = 1.5;          // 正文首段起点
var BODY_GAP = 0.25;       // 正文段间隔（示例值，按段数与总时长微调）
var T_AMBIENT = 0.5;       // 待机氛围驱动起点
var AMBIENT_PERIOD = 3.2;  // 氛围呼吸周期（秒）
```

| 节拍 | 时刻 | 动效 |
| --- | --- | --- |
| 标题级联 | 0.10s 起 | waterfall-entry：锚点词 y70/0.18s，轻词 y44–56/0.12–0.16s，相邻重叠 1 帧 |
| 副标题 | 0.72s | y34 → 0 淡入上移 0.38s |
| 素材卡 | 0.85s | fade-scale：autoAlpha 0→1、scale 0.94→1，`back.out(1.4)`（仅 scale 过冲），0.5s，**无位移** |
| 正文分段 | 1.50s 起 | 每段依次入场（间隔 `BODY_GAP`），y30 → 0 淡入并保留 0.32s |
| 待机氛围 | 0.50s 起 | 卡片 ±6px sine 浮动 + 辉光/细线透明度呼吸，周期 3.2s |

### 6.3 关键代码

标题 token 级联（重量差异化 + 相邻重叠 1 帧）：

```js
var tokens = [
  { id: "#tk1", y: 70, d: 0.18 },  // 锚点词，行程最长
  { id: "#tk2", y: 44, d: 0.12 },  // 轻词
  { id: "#tk3", y: 46, d: 0.14 },
  { id: "#tk4", y: 56, d: 0.16 },
];
var t = T_TITLE;
tokens.forEach(function (k, i) {
  tl.set(k.id, { opacity: 1, y: k.y }, t);
  tl.to(k.id, { y: 0, duration: k.d }, t);
  t += k.d + (i === tokens.length - 1 ? 0 : -F); // 相邻重叠 1 帧
});
```

正文按段入场：

```js
var paras = document.querySelectorAll("#body-paras p");
paras.forEach(function (el, i) {
  var at = T_BODY + i * BODY_GAP;
  tl.set(el, { opacity: 1, y: 30 }, at);
  tl.to(el, { y: 0, duration: 0.32 }, at);
});
```

待机氛围（单一驱动，纯时间函数）：

```js
tl.to({}, {
  duration: 10,
  ease: "none",
  onUpdate: function () {
    var w = (Math.PI * 2 / AMBIENT_PERIOD) * this.time();
    floatEl.style.transform = "translateY(" + (-6 * Math.sin(w)).toFixed(2) + "px)";
    glowEl.style.opacity  = (0.26 + 0.08 * Math.sin(w + 1.1)).toFixed(3);
    edgeA.style.opacity   = (0.28 + 0.08 * Math.sin(w)).toFixed(3);
    edgeB.style.opacity   = (0.20 + 0.08 * Math.sin(w + Math.PI)).toFixed(3);
  },
}, T_AMBIENT);

window.__timelines["main"] = tl;
```

---

## 七、校验与渲染流程

```bash
npx hyperframes lint                        # 快速反馈
npx hyperframes check                       # 完整门：lint + 运行时 + 布局 + 对比度，需 0 错误
npx hyperframes snapshot --at 1.0 3.0 7.0   # 关键时间点截图，视觉自检
npx hyperframes render                      # 出片，产物在 renders/*.mp4
```

- `check` 必须**全绿**：对比度按 WCAG AA 校验（这也是 `--accent` 用深琥珀 `#8f5e00` 的原因）。
- 故意出血的装饰元素加 `data-layout-allow-overflow`；正文内容不允许出血。
- **出片前量总高**：`snapshot` 自检首尾关键帧，确认标题、副标题、素材卡、末段正文全部完整在画面内（正文变长后最常见的翻车点，见 4.1）。
- 渲染后用 ffprobe 复核时长，成片时长用于发布文案中的时长表述。

---

## 八、快速修改对照表

| 想改什么 | 改哪里 | 当前值 |
| --- | --- | --- |
| 画幅 / 时长 / 帧率 | `#root` 的 `data-*` | 1080×1920 / 10.5s / 30fps |
| 内容区宽（左右边距） | `--content-w` | 880px（边距 100px） |
| 标题字号 | `#title` 的 `font-size` | 68px |
| 副标题字号 | `#subtitle` 的 `font-size` | 44px |
| 正文字号 | `#body-paras p` 的 `font-size` | 37px 基准（长正文按 4.1 下调） |
| 正文段间距 | `#body-paras p + p` 的 `margin-top` | 22px |
| 强调色 | `--accent` | `#8f5e00` |
| 背景色 | `--bg` | `#f7f3ea` |
| 素材卡宽高比 | `.media-card video` 的 `aspect-ratio` | 与素材一致（16:9 → 高 495px，第 0 帧锁死） |
| 素材与起播点 | `video` 的 `src` / `data-start` / `data-duration` | loop2.mp4 / 0.8s / 9.7s |
| 正文段间隔 | `BODY_GAP` | 0.25s |
| 氛围呼吸周期 | `AMBIENT_PERIOD` | 3.2s |
| 高亮文案 | `<span class="hl">` | 关键数字与结尾金句 |

---

## 九、复用 Checklist

1. 新建项目目录，按本文各节规范搭建 `index.html`（画布结构见 2.2，字体按 3.3 内嵌生成）。
2. 按素材主色微调 `--accent` 与装饰色相，跑 `check` 确认对比度。
3. 替换文案：标题拆 token（标出 `.tk-ac`）、副标题、正文按原段落 `<p>`（零改写、保留段落、自然换行、段尾句号、加 `.hl`）。
4. 素材：ffmpeg 预编码循环体 → 替换 `video` 的 `src` / `data-start` / `data-duration` → 按素材宽高比改 `aspect-ratio`（宽度固定 880px，高度第 0 帧锁死，禁依赖视频元数据）。
5. 校验：正文较长时先按 4.1 收间距/降字号并量总高 → `check` 全绿 → `snapshot` 自检关键帧 → `render` 出片。
6. 归档：`renders/` 成片，并记录本次与基准参数的差异备查。

---

## 十、注意事项

1. 变速与循环都在 **ffmpeg 阶段**完成，合成内永远 1 倍速线性播放，禁用 `playbackRate`。
2. `data-start` / `data-duration` 只写在 `<video>` 元素上，父级重复声明会导致播放模型错乱。
3. 字体必须项目内嵌 woff2，禁止依赖系统字体；新增字重需同步扩充 `@font-face` 的 weight 区间。
4. 待机氛围动效只用 `sin` 等纯时间函数，禁止随机数、禁止读取真实时钟，保证 seek 与渲染确定性。
5. 文案是硬约束：不改写、不删句，保留原文段落、由浏览器自然换行，段尾标点完整；禁止按标点手动拆行。
6. 浅底配色下，强调色必须选深色变体并通过 WCAG AA；不得直接取素材亮色当文字色。
7. 装饰出血元素加 `data-layout-allow-overflow`，但正文与素材卡不允许出血。
8. 素材区从第 0 帧锁死占位高度（`aspect-ratio` 或显式高度），视频晚到不得撑开布局；素材卡入场只做淡入 + 轻缩放、禁止位移，防止整列基准位跳动。
9. 正文变长时必须先量总高：按 4.1 收间距 → 降正文字号 → 缩素材区，确认四层总高在画布内再出片。

---

*本文档作为快讯风竖屏短视频（NewsFlash）模板的设计与开发规范，所有参数与流程自包含于本文，持续迭代中。*
