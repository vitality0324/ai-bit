---
title: '抖音视频下载本地方案：Playwright + yt-dlp 完整脚本'
description: '在本地或云端 Ubuntu 环境中，用 Playwright 获取抖音有效 cookie，再用 yt-dlp 下载公开视频为 MP4 的完整方案与避坑指南。'
pubDate: 2026-08-21
tags: ['抖音', '视频下载', 'Playwright', 'yt-dlp', 'Python', '爬虫']
---
> 适用场景：在本地/云端 Ubuntu 环境中，将抖音分享链接或视频页链接下载为 MP4。
>
> 稳定程度：中等。抖音风控较严，每次下载前通常需要重新获取有效 cookie。

---

## 一、核心思路

1. 用 **Playwright** 模拟浏览器访问抖音视频页，完成风控初始化，拿到有效 cookie。
2. 将 cookie 导出为 Netscape 格式。
3. 用 **yt-dlp** 携带 cookie 下载视频。

为什么直接 `yt-dlp URL` 不行：抖音网页版接口需要 `__ac_signature`、`ttwid`、`s_v_web_id` 等动态 cookie，否则接口返回空或验证码页。

---

## 二、环境准备

### 1. 安装 yt-dlp

```bash
sudo pip3 install yt-dlp --break-system-packages
```

或下载独立二进制（如果 pip 不可用）。

### 2. 安装 Playwright

```bash
sudo pip3 install playwright --break-system-packages
python3 -m playwright install chromium
```
> 如果环境已预装 Chromium，可以只装 `playwright` 包。

---

## 三、完整参考脚本

保存为 `download_douyin.py`：

```python
import asyncio
import argparse
import re
import os
from urllib.parse import urlparse, parse_qs
from playwright.async_api import async_playwright

def extract_video_id(url: str) -> str:
    """从抖音分享链或视频页链中提取 video ID。"""
    # 标准视频页: https://www.douyin.com/video/7671563950286400101
    m = re.search(r"/video/(\d+)", url)
    if m:
        return m.group(1)

    # 分享链: https://www.iesdouyin.com/share/video/7671563950286400101/...
    m = re.search(r"/share/video/(\d+)", url)
    if m:
        return m.group(1)

    # 兜底：从查询参数取
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    if "aweme_id" in qs:
        return qs["aweme_id"][0]

    raise ValueError(f"无法从链接提取 video ID: {url}")

async def fetch_cookies(video_id: str, headless: bool = True) -> str:
    """用 Playwright 访问视频页并导出可用 cookie 文件。"""
    url = f"https://www.douyin.com/video/{video_id}"
    cookie_path = "/tmp/douyin_cookies.txt"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        except Exception as e:
            print(f"页面加载超时（常见）: {e}")

        # 等待风控脚本和 cookie 写入完成
        await asyncio.sleep(10)

        cookies = await context.cookies()
        print(f"获取到 {len(cookies)} 个 cookie")

        with open(cookie_path, "w") as f:
            f.write("# Netscape HTTP Cookie File\n")
            for c in cookies:
                domain = c["domain"]
                flag = "TRUE" if domain.startswith(".") else "FALSE"
                path = c["path"]
                secure = "TRUE" if c["secure"] else "FALSE"
                expiry = str(int(c["expires"])) if c["expires"] != -1 else "0"
                f.write("\t".join([domain, flag, path, secure, expiry, c["name"], c["value"]]) + "\n")

        await browser.close()
    return cookie_path

def download_with_ytdlp(video_id: str, cookie_path: str, output_dir: str = ".") -> str:
    """调用 yt-dlp 下载视频。"""
    url = f"https://www.douyin.com/video/{video_id}"
    output_path = os.path.join(output_dir, f"douyin_{video_id}.%(ext)s")

    cmd = (
        f'yt-dlp --cookies "{cookie_path}" '
        f'-o "{output_path}" '
        f'"{url}"'
    )
    print(f"执行: {cmd}")
    ret = os.system(cmd)
    if ret != 0:
        raise RuntimeError("yt-dlp 下载失败")

    expected = os.path.join(output_dir, f"douyin_{video_id}.mp4")
    return expected

async def main():
    parser = argparse.ArgumentParser(description="下载抖音视频到本地")
    parser.add_argument("url", help="抖音分享链接或视频页链接")
    parser.add_argument("-o", "--output", default="/workspace", help="输出目录")
    parser.add_argument("--no-headless", action="store_true", help="显示浏览器窗口（调试用）")
    args = parser.parse_args()

    video_id = extract_video_id(args.url)
    print(f"提取到 video ID: {video_id}")

    cookie_path = await fetch_cookies(video_id, headless=not args.no_headless)
    output = download_with_ytdlp(video_id, cookie_path, args.output)
    print(f"下载完成: {output}")

if __name__ == "__main__":
    asyncio.run(main())
```

### 使用示例

```bash
python3 download_douyin.py "https://www.iesdouyin.com/share/video/7671563950286400101/..."
```

或指定输出目录：

```bash
python3 download_douyin.py "https://www.douyin.com/video/7671563950286400101" -o ./videos
```

---

## 四、关键 cookie 说明

yt-dlp 能成功下载，通常需要以下 cookie 至少部分有效：

| Cookie | 作用 |
| --- | --- |
| `__ac_nonce` | 反爬初始令牌 |
| `__ac_signature` | 由前端根据 `__ac_nonce` 计算生成，必须 |
| `ttwid` | 访客身份标识，必须 |
| `s_v_web_id` | 滑动验证码通过后写入 |
| `passport_csrf_token` | 部分接口需要 |
| `odin_tt` | 设备/会话标识 |

这些 cookie 大多几分钟到几小时内有效，**不建议长期保存复用**。

---

## 五、常见问题与处理

### 1. yt-dlp 报错：Fresh cookies are needed

说明 cookie 已失效或缺少 `__ac_signature`。

处理：重新运行脚本获取最新 cookie。

### 2. Playwright 打开页面后触发滑块验证

处理：

- 加 `--no-headless` 参数，手动完成验证后继续。
- 或等几分钟后重试，降低请求频率。
- 或更换 IP / 环境。

### 3. 接口返回空或 HTML 页面

说明风控未通过，cookie 里缺少 `s_v_web_id` 或 `ttwid`。

处理：延长 `await asyncio.sleep()` 时间，让页面充分执行 JS。

### 4. 下载的视频带水印

这是网页版正常行为。如果不需要水印，需要走其他解析逻辑（不在本文档范围内，且稳定性更差）。

### 5. 分享链无法识别

脚本会自动转成 `https://www.douyin.com/video/{id}` 处理。

---

## 六、使用建议

- **不要高频批量下载**，容易被风控。
- **不要长期保存 cookie 文件**，每次运行重新获取。
- **保持 yt-dlp 最新**：```bash
yt-dlp -U
```
- 如果只需要偶尔下载，不必脚本化，直接按本文档步骤手动执行即可。

---

## 七、局限性

- 仅适用于公开视频。
- 需要图形/浏览器环境（Playwright + Chromium）。
- 抖音接口变更后，脚本可能需要同步调整。
- 下载内容为网页版有水印版本。

---

*本文仅供学习与技术研究，请遵守平台规则与相关法律法规。*
