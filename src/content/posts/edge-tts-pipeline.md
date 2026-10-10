---
title: 'edge-tts 配音流水线：音色、语速、字幕与响度标准化'
description: '用 edge-tts 给视频配音的完整流程：14 个中文音色逐一带试听、语速实测、SRT 字幕切分、-16 LUFS 响度标准化，以及音频驱动时间轴。'
pubDate: 2026-08-30
tags: ['Edge TTS', 'AI配音']
---
> 本文面向 **Agent**：如果你被委派给视频配旁白，按第四节的五步顺序执行即可，代码可直接抄改。

edge-tts 是微软 Edge 浏览器「朗读」功能背后的接口，被人逆向成了命令行工具和 Python 库。不用注册、不用 API key、不花钱，中文音质在免费方案里属于第一梯队。

这篇记的是我交付一条 **99.8 秒**中文解说配音（840 字、8 个场景段落、66 条跟随字幕）时跑通的完整流程，以及过程中真正卡住过的几个坑。

## 一、先说清楚适用边界

edge-tts 调的是 Edge 的**内部端点**，微软并未公开授权第三方调用。个人项目、内部工具、原型验证基本没人管；但要进商业产品，建议改用 [Azure AI Speech](https://azure.microsoft.com/products/ai-services/ai-speech)——有正式授权，音色列表和 edge-tts 高度重叠，价格也不高。

另外它不是 REST API 而是 WebSocket 流式接口，**有速率限制**。长文本必须分段 + 失败重试，否则会撞上 `NoAudioReceived`（详见 4.2）。

## 二、安装

```bash
python3 -m venv tts-env
source tts-env/bin/activate
pip install edge-tts
```

**必须建虚拟环境。** 直接用系统 pip 装会报：

```
error: externally-managed-environment
```

这是 PEP 668 —— 现代发行版把系统 Python 标记为「由包管理器托管」，禁止 pip 往里塞东西。加 `--break-system-packages` 能绕过，但会污染系统 Python，不推荐。venv 是正解，代价只是多一句 `source`。

装完验证：

```bash
edge-tts --list-voices          # 列出全部 322 个音色
edge-tts --list-voices | grep zh-   # 只看中文
```

## 三、中文音色全表（14 个，逐个试听）

`--list-voices` 返回 **322 个音色**，中文相关共 **14 个**：普通话 8 个、粤语 3 个、台普 3 个。

下面每个音色的试听样本，读的是同一句：

> MIT 刚刚发现了一件恐怖的事：AI Agent 甚至不需要互相交流，也能自己形成社会、分工、发明技术。

统一 **+50% 语速**（短视频常用档位）。同一句文本各音色时长在 5.8–8.4 秒之间，差异主要来自语流停顿习惯。

### 普通话（zh-CN）

**晓晓** `zh-CN-XiaoxiaoNeural` · 女声 · 温暖 · 新闻 / 有声书

**晓伊** `zh-CN-XiaoyiNeural` · 女声 · 活泼 · 卡通 / 故事

**云健** `zh-CN-YunjianNeural` · 男声 · 激昂 · 体育解说 / 小说

**云希** `zh-CN-YunxiNeural` · 男声 · 活泼阳光 · 小说 / 解说 ← 本次成片选用

**云夏** `zh-CN-YunxiaNeural` · 男声 · 可爱 · 卡通 / 故事

**云扬** `zh-CN-YunyangNeural` · 男声 · 专业可靠 · 新闻播报

**辽宁小北** `zh-CN-liaoning-XiaobeiNeural` · 女声 · 幽默 · 东北方言

**陕西小妮** `zh-CN-shaanxi-XiaoniNeural` · 女声 · 明快 · 陕西方言

### 粤语（zh-HK）

**晓佳** `zh-HK-HiuGaaiNeural` · 女声 · 亲切

**晓曼** `zh-HK-HiuMaanNeural` · 女声 · 亲切

**云龙** `zh-HK-WanLungNeural` · 男声 · 亲切

### 台湾普通话（zh-TW）

**晓臻** `zh-TW-HsiaoChenNeural` · 女声 · 亲切

**晓雨** `zh-TW-HsiaoYuNeural` · 女声 · 亲切

**云哲** `zh-TW-YunJheNeural` · 男声 · 亲切

> 粤语和台普音色拿到普通话书面文本时，会按各自的语言习惯发音——试听里能明显听出来。这不是 bug，用它们做方言内容时反而是对的；做标准普通话内容就老实用 `zh-CN-*`。

## 四、配音流水线

### 4.1 先分段，别整篇丢进去

**不要**把 800 字一次性丢给 TTS。按视频场景切成若干段（我这次是 8 段），好处有三个：

- 单段失败只需重跑这一段，不用全篇重来
- 每段独立出时长，才能做**逐场景的时间轴对齐**
- 段与段之间可以留交叉溶解的余量（我用了 15 帧 @30fps）

```python
SEGMENTS = [
    "MIT 刚刚发现了一件恐怖的事：AI Agent 甚至不需要互相交流，"
    "也能自己形成社会、分工、发明技术。",
    "来自 MIT 的团队，把数百个最初完全相同的 AI Agent 扔进一个共享世界。",
    # ...
]
```

### 4.2 生成音频与 SRT

命令行一把梭：

```bash
edge-tts --voice zh-CN-YunxiNeural --rate=+50% \
  --text "你的旁白文本" \
  --write-media s1.mp3 --write-subtitles s1.srt
```

Python 里用 `edge_tts.Communicate`，但**必须加重试**——微软接口会间歇性返回 `NoAudioReceived`，而且不规律（我这次 +50% 那轮第 2 段连挂 4 次、第 7 段挂 2 次，全部重试后成功）：

```python
import edge_tts

async def gen_one(text, mp3, srt, voice, rate, tries=6):
    for attempt in range(tries):
        try:
            communicate = edge_tts.Communicate(text, voice, rate=rate)
            with open(mp3, "wb") as f:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        f.write(chunk["data"])
            # 校验体积：接口偶发返回空文件，光看退出码发现不了
            if os.path.getsize(mp3) == 0:
                raise RuntimeError("empty audio")
            break
        except Exception as e:
            if attempt == tries - 1:
                raise
            await asyncio.sleep(1.2 * (attempt + 1))
```

**坑：别用 `SubMaker` 取字幕。** Python API 的 `submaker.get_srt()` 会产出 0 字节文件。改用 CLI 的 `--write-subtitles`，稳定可靠。

### 4.3 字幕二次切分

TTS 给的 SRT 是**句子级**的，直接拿来当字幕会溢出画面。要按显示宽度再切一刀：

```python
MAX_WIDTH = 15          # 单行最大"字宽"

def char_width(s: str) -> float:
    """中文/全角算 1，英文数字算 0.6"""
    return sum(0.6 if ord(ch) < 128 else 1.0 for ch in s)
```

切分规则：

1. 先按标点（`，。、；：！？`）断句
2. 拼到接近 `MAX_WIDTH` 就换行
3. 无标点的长句，按**英文单词边界**补切一刀，避免从单词中间断开
4. 时间按字符宽度**比例分配**——`AI Agent` 这种中英混排，按字数平分会明显错位

还有个隐蔽的坑：切分正则如果写成 `[^，。、；：！？\s]*`，会把文本里**原有的空格吃掉**，于是出现 `MIT刚刚`、`AIAgent`。正则里别排除 `\s`。

### 4.4 响度标准化（这步最容易漏）

edge-tts 原始输出约 **-24 LUFS**，直接混进成片，手机外放会明显偏轻。

做两遍 EBU R128 归一化到 **-16 LUFS / -1.5 dBTP**：

```bash
# 第一遍：测量
ffmpeg -i raw.wav -af loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json -f null /dev/null 2>&1 | tail -14

# 第二遍：应用（把测得的 measured_* 填回去）
ffmpeg -i raw.wav -af "loudnorm=I=-16:TP=-1.5:LRA=7:measured_I=-24.1:measured_TP=-9.2:measured_LRA=3.4:measured_thresh=-34.5:offset=0.6:linear=true" \
  -ar 48000 -ac 2 -c:a aac -b:a 320k narration.m4a
```

关键点：

- **`linear=true`** —— 只施加恒定增益，不做动态压缩，人声不会发闷
- 目标取 **-16 LUFS**：抖音 / 视频号 / 小红书的平台归一化目标普遍在 -14~-16 LUFS，这个档位不会被二次拉扯
- 拼接多段时先转 wav 中间体再处理，避免 mp3 帧头导致时间戳漂移

### 4.5 用音频时长驱动时间轴

最后一步是让画面跟着声音走，而不是反过来：

```
音频时长 → TOTAL_FRAMES → 场景时间轴 → 字幕时间轴
``````python
FPS = 30
TOTAL_FRAMES = int(audio_duration * FPS)
```

每个场景的时长由它的音频长度决定，画面只是「填充」到这个长度。这样做的好处是**改文案后重跑一遍脚本，画面和声音自动重新对齐**，不用手动调。

注意别从已渲染的视频读时长——换语速之后旧成片还是旧长度，会把新音频错误地补齐或截断。

## 五、参数速查

| 参数 | 取值 | 说明 |
| --- | --- | --- |
| `--voice` | 音色 ID | `edge-tts --list-voices` 查全量 |
| `--rate` | `-100%` ~ `+100%` | 默认 `+0%`；短视频常用 `+30%` ~ `+50%` |
| `--volume` | `-100%` ~ `+100%` | 默认 `+0%` |
| `--write-media` | 文件路径 | 音频输出（mp3, 24kHz） |
| `--write-subtitles` | 文件路径 | SRT 字幕输出 |

**语速实测**：840 字原文，原速约 **152 秒**；`+50%` 后成片 **99.8 秒**。

（略快于理论值 101 秒，是因为 8 个段落之间各留了 15 帧交叉溶解，有重叠。）

选语速的经验：中文旁白 **+30% ~ +50%** 是舒适区，再快含混度会明显上升；`+80%` 以上基本只适合做快节奏卡点，信息密度一高就听不清了。音色选 `zh-CN-YunxiNeural`（云希）在解说类内容里表现最稳——活泼但不轻浮，长句也不塌。
