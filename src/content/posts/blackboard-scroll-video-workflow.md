---
title: '黑板长卷短视频 · 制作流程手册（一镜到底 · 无限画布）'
description: '基于 HyperFrames + edge-tts 的竖屏知识短视频模板规范：无限画布黑板长卷 + 分镜板三态 + 打字机同步，发布时另附 3:4 大字报封面。附完整模板工程包下载与 Agent 可执行的制作流程。'
pubDate: 2026-09-07
cover: '/images/cover-2.svg'
tags: ['短视频', 'Workflow', 'HyperFrames', '模板规范', '一镜到底']
---
# 黑板长卷短视频 · 制作流程手册（一镜到底 · 无限画布）

> **读者**：负责制作视频的 AI Agent。
> **目标**：拿到一篇旁白文字后，按本手册产出一条与本账号既有风格完全一致的竖屏知识短视频。
> **验收基准**：1080×1920 / 片长 = 配音时长 + 4.7s 引导层 / check 全绿（lint 0 error + 文字对比度 100% WCAG AA）/ 多模态读帧质检通过（内容不越安全区，相邻板边缘粉笔除外）/ 整体响度 -11.5 ~ -13 LUFS（2026-09-11 音量重平衡后）。作为短视频发布时，另交一张 **3:4 封面（1080×1440）**，做法见 §7。
>
> **代码与资源**：全部代码（引擎、渲染模板、工具脚本）、参考实例、图片/音频资源、封面壳打包在 **[blackboard-template.zip](https://ai-bit.tech/skills/blackboard-template.zip)** 中（文末附下载）。手册只写流程与规范，不复述代码。

---

## 1. 成品风格

- **形态**：1080×1920 竖屏「一镜到底长卷」——所有内容铺在一张巨大的虚拟黑板画布上，镜头沿画布漫游，配画外音打字机逐字呈现。
- **视觉**：每段内容 = 一块带实木框的小黑板（三态：待讲暗淡 → 正在讲点亮+粉笔辉光 → 归档缩小 0.58 褪色沉底）；板间用虚线相连；粉笔白/蓝 `#86C5FA` /黄 `#E8D44D` /红 `#FF8C7E` 四色体系；线条图标/手绘 SVG 粉笔化（视觉素材由创作 Agent 按视频内容自行选定）。
- **安全区（硬约束）**：上下 300px、左右 100px（内容区 880×1320）；所有内容含动画过程不得越出。卡片上下内边距 34px、图示内容整体缩进 31px。
- **文字**：正文 44px 上限，按句子分块自然折行，打字机逐字出现（15 字/秒，逗号停 0.16s、句号停 0.32s），关键词着色并弹跳。
- **音频**：edge-tts 音色 `zh-CN-YunjianNeural` 语速 +30%，loudnorm 归一到 **-14 LUFS**；混音时旁白再 **+2 dB**（≈ -12 LUFS，限幅保护峰值），BGM 固定用 `c260.mp3`（DJ L《C260》）volume **0.22**（≈ -21.3 LUFS）无闪避，淡入 1.5s / 淡出 5.5s。人声与 BGM 响度差约 9 LU（2026-09-11 重平衡：原 0.3 配方 BGM 偏大、旁白偏小）。
- **结尾**：镜头拉远看整面黑板 → 覆盖「高老师的分享局」关注引导卡（logo 用 `logo.png`。

## 2. 代码包与目录结构

本手册与代码包 **[blackboard-template.zip](https://ai-bit.tech/skills/blackboard-template.zip)** 一起参考（代码、参考实例、图片/音频资源、封面壳全在里面）。解压后得到：

```
blackboard-template/
├── README.md                    ← 包内速览（内容清单 + 依赖）
├── template/                    ← 引擎层（冻结层，除 bug 修复外不要动）
│   ├── composition/index.html   ← 渲染工程模板壳（CSS+DOM+@@ENGINE@@ 占位符）
│   ├── composition/{package.json, hyperframes.json}
│   ├── engine/core.js           ← 引擎本体：排布/镜头/黑板三态/连线跟随/打字机/CTA/动效工具
│   ├── assets/                  ← 图片音频资源（见下表）
│   └── tools/                   ← 5 个 Python 脚本（见下表）
├── example/                     ← 参考实例 hidden-state 项目源文件
│   ├── script.txt               ← 旁白原文（空行分段）
│   ├── config.js                ← 项目参数示例
│   └── boards.js                ← 图示创作示例（14 个 case，覆盖全部常用模式）
└── cover/                       ← 封面壳（3:4 大字报，见 §7；每期只改槽位）
    ├── cover.html               ← 固定壳。默认填着示例期文案，出片前必须替换
    └── README.md                ← 填槽说明 + 渲染命令
```

每个短视频 = 一个独立项目目录（`new_video.py` 创建，位置任意，与 `blackboard-template/` 平级或另放）：

```
<视频项目>/
├── script.txt               ← 旁白文字，空行分段（唯一文字输入）
├── config.js                ← 项目参数
├── boards.js                ← 图示创作（Agent 独立实现）
├── cover/                   ← 仅短视频发布时需要（Step 7：从包内 cover/ 复制后改槽位）
│   ├── cover.html
│   └── cover-1080x1440.png  ← HTML 截图产物
└── build/
    ├── audio/               ← tts.py 输出（s{i}.wav/.srt、narration.m4a、narration_bgm.m4a）
    └── composition/         ← 自包含渲染工程
        ├── index.html       ← 模板壳 + 内联引擎
        ├── assets → template/assets
        ├── audio  → build/audio
        ├── config.js / boards.js → 项目源文件 (symlink)
        ├── scenes_data.js
        └── renders/         ← 渲染输出
```

**资源清单（都在 `template/assets/`，解压即得，无需手动放置）**：

| 文件 | 用途 |
| --- | --- |
| `board_wall.jpg` | 烘焙好的整面黑板墙（板面+木框一体），camPan 背景 |
| `wood_frame_9.png` | 实木框九宫格贴图（卡片 border-image） |
| `logo.png` | 账号 logo（结尾引导卡） |
| `bgm/c260.mp3` | 背景音乐（DJ L《C260》，129.3s） |
| `wood_frame_src.jpg` | 木纹原图（CC BY-SA 4.0，仅重制贴图时用） |

**工具脚本**（都在 `template/tools/`，用系统 `python3` 跑，依赖仅 ffmpeg/ffprobe + edge-tts + Pillow/numpy）：

| 脚本 | 作用 |
| --- | --- |
| `new_video.py <项目路径>` | 视频项目脚手架（创建独立项目目录 + 自包含渲染工程；已存在则刷新渲染工程，不覆盖源文件） |
| `tts.py <视频项目>` | script.txt → 配音 `build/audio/narration.m4a`（-14 LUFS）+ 各段 srt/wav |
| `build_scenes.py <视频项目>` | 配音 srt → `build/composition/scenes_data.js`（打字机时间轴） |
| `mix.py <视频项目> [--mux <video>]` | C260 固化配方混音；`--mux` 时合成 `build/final.mp4` |

## 3. 制作流程

### Step 0 创建视频项目

首次使用先解压 [blackboard-template.zip](https://ai-bit.tech/skills/blackboard-template.zip)，下文以解压出的 `blackboard-template/` 为根。

```bash
cd <blackboard-template>/template/tools
python3 new_video.py ../../my-video   # 项目名自取；一个文档 → 一个独立项目目录
```

产出项目目录骨架。**★ 闸门 1：分段**——把用户的旁白文字填入 `script.txt`（**严格原文，不优化**；空行分段，一段=一块画板），把分段结果给用户确认。

### Step 1 配音

```bash
python3 tts.py ../../my-video
```

产出 `build/audio/narration.m4a` + 各段 `s{i}.wav/.srt`，并打印「回填 config.js」的 4 个时长参数。**★ 闸门 2：试听** `narration.m4a` 给用户确认。

### Step 2 时间轴

```bash
python3 build_scenes.py ../../my-video
```

产出 `build/composition/scenes_data.js`。核对输出段数/总时长与 Step 1 报告一致。

### Step 3 回填 config.js + 图示创作 boards.js

见 §4（config.js 字段）与 §5（结构边界与图示创作）。这是每个视频的核心创作步骤。

### Step 4 检查与渲染

```bash
cd ../../my-video/build/composition
npm run check     # 必须全绿：lint 0 error + 文字对比度全部 WCAG AA
npm run render    # 约 1-3 分钟，输出 renders/composition_*.mp4
```

### Step 5 质检（多模态读帧）

抽 14-16 个关键帧（每块画板收尾时刻 + 开头 1s + 结尾 CTA，时刻取 scenes_data.js 各段 `end` 附近），**用多模态大模型逐帧读图检查**：

- 内容是否越出安全区（上下 300px、左右 100px）；边缘轻微越界若为相邻画板的边缘粉笔（背景允许溢出）可放行
- 图示与文案语义匹配、无文字贴木框、光点 fade 不越归档
- 打字机进度与画面元素对应（正在讲的板应是点亮态）

发现问题改 boards.js / config.js 后回到 Step 4。

**★ 闸门 3：成片画面**给用户审。

### Step 6 混音出片

```bash
python3 ../../../template/tools/mix.py ../../my-video \
  --mux <composition 目录下 renders 里的 mp4 路径>
```

产出 `build/final.mp4`（视频流不重编码）。实测整体响度应在 -11.5 ~ -13 LUFS、真峰 < 0 dBTP。**★ 闸门 4：终审交付**。

### Step 7 封面（作为短视频发布时）

成片终审之后、发布之前做。标题已经锁定：封面服从标题，不要为了排版回头改标题。

1. 复制封面壳：`cp -R <blackboard-template>/cover <视频项目>/cover`
2. 只改 `cover.html` 里标明 `SLOT` 的几处（通常 2–4 个：标题断行、着色词、印章文案、副句和圆章留或不留）。规则见 §7。
3. 按 `cover/README.md`，用 Chrome headless（或 Playwright）把 HTML 截成 `cover-1080x1440.png`。
4. **先自己打开这张 PNG 读图**，再给用户看。标题要完整、落在框内、没有挤成难看的三行；印章和圆章不压中部文案；对比度够；图形不超过 3 类。不过就改槽位重截。禁止改用 AI 生图。
5. 给用户确认。

**★ 闸门 5（轻）：封面口味**——用户点头，这张封面才可以发。

## 4. config.js 字段说明

```js
window.EP_CONFIG = {
  duration: 123.5,   // 片长 = narrDuration + 引导层停留（一般 +4.7s）
  narrDuration: 118.8,  // tts.py 报告的配音成片时长
  outStart: 116.8,   // 收尾拉远开始 ≈ 最后一段打字结束前 0.2s（留 0.1 给归档动画）
  outDur: 1.6, ctaIn: 118.5,  // ctaIn ≈ narrDuration - 0.3
  zoomOut: 0.137,    // 全景比例（整面黑板缩进视口），固定
  cols:  [0,0,1,1,0,...],  // 每段所在列：0=左列 1=右列，长度=段数。建议左右交错（0,0,1,1 循环）
  vh:    [430,430,...],    // 每段图示区高度（340-560，简单段小、复杂段大），长度=段数
  zoomPeeks: [[5,30.0,36.5],...],  // 关键节点整板展示 [[段号(1起), 拉远开始, 拉回结束], ...] 0-3 处
  keywords: [["hidden state","b"],...]   // 打字机关键词着色：b=蓝 g=黄 r=红
};
```

`cols`/`vh` 的确定方法：读完文案后按每段信息量预估（数字统计类段 vh 420-520、单纯叙述段 340-430），首渲后按画面微调。完整示例见 `example/config.js`。

## 5. boards.js：结构边界与图示创作

画布与画板的结构、样式全部由引擎负责；boards.js **只负责画板下半图示区的内容创作**，其余一律不要碰。

### 5.1 固定结构与样式（引擎强制，勿改）

- **画布**：整面黑板墙，镜头沿画布漫游；板间虚线相连。
- **画板**：每段文案 = 一块带实木框的小黑板；**上半 = 打字机文字区**（逐字呈现、关键词着色，文字与时序来自 scenes_data.js）；**下半 = 图示区**（高度 = config.vh）。
- **画板三态**：待讲暗淡 → 正在讲点亮+粉笔辉光 → 归档缩小褪色沉底。
- **安全区**：所有内容含动画过程不得越出（上下 300px、左右 100px）。

### 5.2 接口与硬约束

```js
function buildBoards(ctx) {
  const { b, i, z, vh, S, E, T, tl, ... } = ctx;   // 上下文与可用原语的完整签名见 template/engine/core.js 注释
  switch (b.sc.id) {   // 从 1 起，对应 script.txt 第几段
    case 1: { ... break; }
  }
}
```

- **所有动画时刻用相对语法，绝不写绝对秒**：`S`/`E` = 本段配音开始/结束；`T(j)` = 本段第 j 句（0 起）的开始时刻。例：`S + 0.4`（段首登场）、`T(1) + 1.2`（第二句讲到处）、`E - 0.15`（段尾前收）。
- 图示内容（含动画过程）不得越出 `z` 容器（872 宽 × vh 高）。
- 元素不设入场动画则一直可见——**默认都给入场**。
- 中英混排的 HTML 字符串写成**单行**（源码换行会被折叠成空格，中文间多出空格）。

### 5.3 图示创作（自由发挥）

- 图示区内容完全由 Agent 按本视频文案自行设计：SVG、手绘 path、图形、图表皆可。引擎只提供结构原语（建元素/SVG/路径绘制/入场动画等，签名见 core.js 注释）；图标卡、印章、计数等**内容动效辅助按本视频需要自建**——写法参考 `example/boards.js` 顶部自建辅助的方式。
- **不要套用参考实例的具体图式**——`example/boards.js` 只是接口用法与完成度方面的参考，不是模式库；每个视频的视觉表达应当从文案本身出发。
- 视觉素材自选并直接写进 boards.js（如需用引擎的图标函数，在文件顶部提供 `window.ICONS = { 名: "<path…/>" }`，键名带连字符必须加引号）。

## 6. 质量清单（交付前逐项打勾）

- check 全绿（lint 0 error，对比度 100% WCAG AA）
- 多模态读帧质检：内容不越安全区（相邻板边缘粉笔除外），图示语义匹配、三态正确
- 每块画板关键帧目检：图示与文案语义匹配、无文字贴木框、动画元素不越画板
- 打字机与配音同步（抽查 2-3 段首句）
- final.mp4 时长 = config.duration；整体响度 -11.5 ~ -13 LUFS，真峰 < 0 dBTP
- 开场无全景跳入（直接第一块板）；结尾 CTA 卡 logo/箭头方向正常
- 作为短视频发布：封面 1080×1440，由 `cover.html` 截图得到（禁止 AI 生图）；槽位已换成当期文案，不是示例期原文
- 封面 PNG 自检过：标题一眼可读、在框内、没有挤成难看三行；印章/圆章不压中部文案；对比度够；图形元素 ≤3 类
- 用户确认封面口味（闸门 5）

---

## 7. 封面制作规范（大字报克制版）

> 短视频发布时和成片一起交。封面不是片里某一帧，也不是另一套生成流程：壳固定，每期只改槽位。已验收的参考实现在包内 `cover/cover.html`（示例期标题「执行和验收拆开：/goal的实现原理」）。**每期必须把槽位换成当期文案**，不要把示例词原样发出去。

### 7.1 固定规则

- **尺寸**：3:4，**1080×1440**。
- **管线**：写 HTML，用 Chrome headless 截图（或 Playwright 等确定性的 HTML→PNG）。**禁止 AI 生图 / image-generation 工具**。同一份 HTML 必须能再次截出同一张图。
- **语气**：严肃、少噱头。标题在缩略图里也要一眼可读。
- **视觉重量**：标题占注意力的大头。图形元素**最多 2–3 类**。不要在封面上画密集流程图、分步示意图。
- **色板**（克制黑板。不要小红书式红紫撞色，不要全霓虹）。这是封面壳专用色，与 §1 片内粉笔色（`#86C5FA` / `#E8D44D`）分开，不要为了「统一」去改壳：

| 角色 | 色值 | 用途 |
| --- | --- | --- |
| board | `#16241c` / `#1e3026` | 板面（暗绿） |
| chalk | `#F3F0E4` | 主标题、粉笔字 |
| muted | `#9aa897` | 眉题等次要信息 |
| accent | `#7EC8F8` | 关键词、`/goal` 一类术语 |
| warm | `#E8C85A` | 验收、强调 |

- **版式壳**（从上到下，槽位固定，不要增删层级）：
  1. 外框
  2. 顶栏眉题（可选，短系列标签）
  3. **衬线大标题**（Noto Serif CJK / 宋体等衬线）。大字主导。中文显示字号建议 **≤112px**（壳内默认 108px），按字数断成一行或两行，避免挤成难看的三行
  4. 可选的一句中部文案（可以整段删掉）
  5. 印章 / 标签 pill **不超过 3 个**，硬阴影
  6. 底栏
  7. 可选圆章（贴题才留，否则删掉整个圆章；不要压住中部文案或标题）
- **做法**：固定壳 + 每期只改 **2–4 个槽位**（标题断行、着色词、印章文案、副句和圆章留或不留）。不要做成「填一个标题就自动出图」的黑盒。

`.big` 的两行是 `white-space: nowrap`。字太长不会折成第三行，会直接冲出外框。冲出去就改断行，或把字号降到仍然占主导、且不超过 112px。不要加第三行来硬塞。

### 7.2 每期可改的槽位

- 标题文字和断行；哪些词用 accent（`.goal`），中部强调用 warm（`<b>`）
- 眉题、底栏、印章上的字
- 中部那一句出不出；圆章出不出

印章只有三个颜色角色，对应壳里已有的 class，不要再加第四枚：`.exec` 是 accent 描边，`.split` 是粉笔底反白，`.accept` 是 warm 描边。换字，不换壳。

### 7.3 风格来源

手法从 [EwingYangs/social-media-cover](https://github.com/EwingYangs/social-media-cover) 的 `bigtype-cover` 收过来：外框、大字、印章、硬阴影，再落到上面的黑板色板。只借手法，不要求克隆那个仓库。像素基准以包内 `cover/cover.html` 为准。

### 7.4 渲染与自检

在已经改好槽位的 `cover.html` 所在目录：

```bash
CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1080,1440 \
  --screenshot=cover-1080x1440.png \
  "file://$(pwd)/cover.html"
```

`--force-device-scale-factor=1` 要留着，否则高分屏会截出 2 倍尺寸。等价做法：Playwright / Puppeteer，`viewport` 1080×1440、`deviceScaleFactor: 1`，对 `cover.html` 截图。机器上要有 **Noto Serif CJK SC**（或宋体）和 **Noto Sans SC**；缺字体会换掉大字气质，先装字体再截。

截完用读图核对尺寸（模板依赖里已有 Pillow）：

```bash
python3 -c "from PIL import Image; im=Image.open('cover-1080x1440.png'); assert im.size==(1080,1440), im.size"
```

然后**打开 PNG 自己读一遍**，通过后再给用户：

- 标题完整、在外框内，没有被裁，没有冲出框，没有挤成难看的三行
- 印章、圆章不压中部文案，也不压标题
- 粉笔字和暗绿板面对比够，缩略图里标题仍可读
- 图形元素不超过 2–3 类
- 文件就是 1080×1440

不通过只改槽位或断行，重跑同一条截图命令。

---

---

## 模板工程包下载

[⬇︎ blackboard-template.zip](https://ai-bit.tech/skills/blackboard-template.zip)（5.8MB，29 个文件）——内含渲染工程模板壳、引擎 `core.js`（画布/画板三态/打字机/镜头/CTA + 结构原语）、4 个工具脚本（new_video / tts / build_scenes / mix）、参考实例 hidden-state 三源文件、全部图片音频资源与素材署名记录，以及 `cover/`（3:4 封面 HTML 壳 + 渲染说明）。解压即得完整工程，配合本手册 §3 使用（成片见 Step 0–6，封面见 Step 7 与 §7）。
