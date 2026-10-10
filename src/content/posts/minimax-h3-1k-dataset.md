---
title: 'MiniMax H3 - 1K 视频数据集资源'
description: 'Ostris 开源的 1K MiniMax H3 生成视频数据集，覆盖多种主题和风格，包含 YouTube 1.5 小时完整浏览和 Hugging Face 下载链接。'
pubDate: 2026-08-12
cover: '/images/cover-3.svg'
tags: ['MiniMax', 'H3', '视频数据集', 'HuggingFace', 'AI视频']
---
> 1K MiniMax H3 videos covering a wide scope of topics and styles to test the model’s capabilities.

这条 [X 平台帖子](https://x.com) 由 **Ostris** 发布，是其为测试 MiniMax H3 能力而生成并开源的视频数据集。如果你刚接触 MiniMax H3，想快速了解它能生成什么风格、什么主题的画面，这个数据集是最直观的参考之一。

## 资源链接

- **YouTube 完整版（1.5 小时）**：<https://youtube.com/watch?v=akkwj9d943Y>
- **Hugging Face 数据集**：<https://huggingface.co/datasets/ostris/minimax_h3_1k>

## 数据集概况

| 项目 | 内容 |
| --- | --- |
| 名称 | MiniMax H3 - 1K |
| 作者/组织 | Ostris |
| 平台 | Hugging Face Datasets |
| 视频数量 | 1,000 个视频样本（页面显示 3,000 rows，可能包含训练元数据/多版本） |
| 总文件大小 | 约 1.43 GB |
| 基础分辨率 | 768 base resolution（约 0.6 MP，具体宽高比不固定） |
| 生成模型 | `minimax_h3_fl2va_pruned_int8_convrot.safetensors` |
| 采样步数 | 30 steps |
| 视频风格 | 涵盖多种主题和视觉风格，用于测试模型能力边界 |

## 为什么这个数据集有价值

1. **能力覆盖广**：数据集覆盖了不同主题和风格，可用于观察 MiniMax H3 在多样化提示下的表现。
2. **直接可下载**：Hugging Face 数据集支持按文件下载，方便本地筛选、剪辑或二次创作。
3. **配套长视频**：YouTube 上的 1.5 小时合集可以快速浏览全部生成结果，适合做视觉参考或灵感收集。
4. **附带元数据**：数据集包含 `integrated_multimodal_description` 等字段，可用于研究生成提示与画面之间的关系。

## 在本项目中的使用方式

我在 [`cod-opus-short`](https://github.com) 短视频项目中，从该数据集筛选了 **1:1 方屏** 的 MiniMax H3 生成视频作为 B-roll 素材，用于 Remotion 短视频的 2×3 网格展示。

筛选逻辑：

1. 下载 Hugging Face 数据集中的视频文件
2. 使用 ffmpeg 检测每个视频的实际宽高尺寸
3. 仅保留宽度等于高度（1:1）的方屏素材
4. 将帧率统一转码为 30fps，方便与 Remotion 时间轴对齐

## 使用建议

### 筛选特定比例素材

```bash
# 检测单个视频分辨率
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of csv=s=x:p=0 video.mp4
```

### 批量筛选 1:1 方屏素材

```bash
for f in *.mp4; do
  wh=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$f")
  w=$(echo "$wh" | cut -d'x' -f1)
  h=$(echo "$wh" | cut -d'x' -f2)
  [ "$w" -eq "$h" ] && echo "$f ${w}x${h}"
done
```

### 统一转码为 30fps

```bash
ffmpeg -i input.mp4 -vf "fps=30,format=yuv420p" -c:v libx264 -crf 18 -pix_fmt yuv420p output.mp4
```

## 相关链接

- **Hugging Face 数据集主页**：<https://huggingface.co/datasets/ostris/minimax_h3_1k>
- **YouTube 1.5 小时合集**：<https://youtube.com/watch?v=akkwj9d943Y>
- **MiniMax H3 官方模型**：<https://huggingface.co/MiniMaxAI/MiniMax-H3>
- **Ostris AI Toolkit**：<https://github.com/ostris/ai-toolkit>

## 备注

- 数据集中的视频宽高比不固定，包含横屏、竖屏、方屏等多种形式，使用前需要根据目标画布尺寸筛选。
- 原始素材帧率为 24fps，建议在与 Remotion 等固定帧率渲染工具配合时，先用 ffmpeg 统一为 30fps。
- 数据集视频生成自量化版模型，质量与官方完整版可能存在差异，但作为快速测试和视觉参考已经足够。
