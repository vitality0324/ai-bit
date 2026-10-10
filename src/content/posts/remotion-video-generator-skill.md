---
title: 'Remotion 视频生成 Skill 工具包：给 AI Agent 的开箱即用流水线'
description: '给 AI Agent 用的 Remotion 视频生成 Skill 工具包，标准 Agent Skills 格式，Cursor / Claude Code / Codex / CodeBuddy 通用。含 6 个子 Skill、24 个模板与 8 个实战环境坑的规避方案。'
pubDate: 2026-08-30
cover: '/images/cover-2.svg'
tags: ['Remotion', 'AI视频']
---
一个可直接安装的 Skill 工具包，装到 Agent 上之后，它就能听懂「帮我做个 60 秒解说视频」这类需求，并自己走完**环境检测 → 分镜规划 → 生成 Remotion 代码 → 渲染成 MP4** 的完整流程。

用 React 写视频，产出的是可编辑的 `.tsx` 代码而不是死板的工程文件——想改配色、改文案、改动效，改完重新渲染即可。

> 本文面向 **Agent**：如果你是被委派来做视频的 Agent，下载解压、放进你的 Skill 目录即可获得这套能力。

## 一、格式与兼容性

这是**标准的 Agent Skills 格式**——每个 Skill 就是一个目录，里面放一份带 YAML frontmatter 的 `SKILL.md`。所以它不绑定任何特定 Agent：

Cursor、Claude Code、Codex、CodeBuddy，以及任何实现了该格式的工具，都能加载。

每个 Agent 都有自己的插件目录和安装命令，**按你自己 Agent 的方式放置即可**，本文不做假定。真正需要放的只有 `skills/` 这 6 个目录，其余部分按需取用：

| 目录 | 作用 | 建议 |
| --- | --- | --- |
| `skills/` | 6 个 Skill，能力本体 | **必装** |
| `templates/` | 24 个视频类型 / prompt 模板 | 一起装 |
| `实战补充/` | 8 个环境坑 + 3 个可复用脚本 | 一起装，强烈建议 |
| `agents/` | 专家人设（「视频匠 / Remy」） | 可选 |
| `license/` | 5 个第三方协议 | 分发时必须原样保留 |

包里没有平台专属的清单、配置文件或市场元数据——**不绑定任何一个 Agent**。

放好后可以跑一下自带的 `./validate.sh`，它会校验目录结构，以及 6 份 `SKILL.md` 的 frontmatter 是否符合规范。

**前置依赖**：Node.js 18+、ffmpeg / ffprobe、Chromium。若需要 TTS 配音，另需 Python 3 + venv（用于安装 edge-tts）。

## 二、包含什么

解压后是一个标准的 Agent Skills 包，共 87 个文件、67 篇 Markdown、约 17000 行。

```
remotion-video-generator/
├── agents/remotion-video-expert.md # Agent 人设（「视频匠 / Remy」）
├── skills/                         # 6 个子 Skill
│   ├── video-generator/            # 主编排：四阶段工作流（1323 行）
│   ├── scene-planner/              # 分镜规划（1032 行）
│   ├── environment-setup/          # 环境检测与安装（544 行）
│   ├── remotion-best-practices/    # 最佳实践：46 行主文件 + rules/ 31 个专题
│   ├── lucide-icons/               # 图标检索（带脚本）
│   └── bgm-library/                # 背景音乐库（带脚本）
├── templates/                      # 24 个模板（14 类视频 + 10 个 Prompt）
├── license/                        # 5 个第三方协议
├── validate.sh                     # 校验脚本：目录结构 + frontmatter 合规性
└── 实战补充/                       # 8 个环境坑 + 3 个可复用脚本
```

6 个子 Skill 的分工：

| Skill | 负责 | 何时被调用 |
| --- | --- | --- |
| `video-generator` | 主编排，串起四阶段流程 | 检测到视频需求时自动激活 |
| `scene-planner` | 把文案拆成分镜，规划时长与转场 | 需要结构化分镜时 |
| `environment-setup` | 检测并安装 Node / ffmpeg / Remotion | 环境不满足时 |
| `remotion-best-practices` | 动效、时序、字幕、字体、图表等 31 个专题 | 写代码查规范时 |
| `lucide-icons` | 检索并生成 Lucide 图标组件 | 需要图标时 |
| `bgm-library` | 背景音乐检索 | 需要配乐时 |

有个设计值得留意：`remotion-best-practices` 的主文件只有 46 行，细节全拆进 `rules/` 下的 31 个专题文件按需加载。这样既不会一次性塞满上下文，又能覆盖到细节。

## 三、什么时候会触发

用户提到以下任一情况时会自动激活：

- 明确需求：「做个视频」「生成视频」「渲染成 MP4」
- 视频类型：解说视频、产品演示、社媒短视频、演示文稿、数据可视化
- 动效相关：motion graphics、动画视频、可视化呈现

**擅长**：数据驱动、可程序化生成的场景——解说视频、产品 Demo、财报可视化、社媒内容、教程视频。

**不擅长**：复杂转场特效、精细音频混音、实拍素材剪辑。这类需求建议交给剪映 / PR / 达芬奇，Remotion 的优势在”代码可迭代”，不在”手工精修”。

## 四、下载

| 项 | 值 |
| --- | --- |
| 版本 | v1.0.4 |
| 体积 | 230 KB |
| 下载 | <https://ai-daily.tech/skills/remotion-video-generator-v1.0.4.zip> |
| 原始仓库 | <https://github.com/addunt/short-video-blog> |

解压即用，无需构建。放进你的 Agent 的 Skill 目录即可，不依赖任何特定 Agent。
