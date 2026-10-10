---
title: 'Claude Code 新功能：会话间通信完整指南'
description: 'Claude Code v2.1.224 上线跨会话通信：多个终端会话可互相发消息、传递摘要、接力任务。本文详解功能原理、使用方式、适用场景与安全边界。'
pubDate: 2026-08-10
tags: ['Claude Code', 'Claude', 'AI编程', '效率工具', '跨会话通信']
---
## 一、这个功能是什么？

2026 年 8 月 7 日，Anthropic 在 Claude Code v2.1.224 中正式上线了**跨会话消息传递（Cross-session Messaging）**功能。

简单说：**你同时打开的多个 Claude Code 终端会话，现在可以互相发消息了。**

以前，如果你在多个终端窗口里分别跑前端、后端、迁移任务或不同 Git Worktree，当 A 会话得出一个结论、B 会话需要知道时，你必须自己复制粘贴上下文。现在 Claude 可以自动写一个摘要，直接把消息发给另一个会话，对方在任务中途就能收到并继续处理。

官方原话是：

> “New in Claude Code: your sessions can now message each other. Instead of having to re-explain yourself in another session, you can now tell Claude to do it. It sends a summary (not your history or files), and the other session picks it up mid-task.”
> —— @ClaudeDevs

---

## 二、它到底能做什么？

跨会话通信的核心，是让多个独立运行的 Claude Code 会话之间，有了一个受控的文本消息通道。消息里只包含 Claude 自己写的摘要，**不会发送你的对话历史、文件内容或权限状态**。

典型使用场景有四类：

### 1. 传递发现和结论

A 会话在排查后端时发现了会影响前端的破坏性变更，Claude 可以直接把这条发现摘要发给正在写前端的 B 会话，而不需要你手动转述。

### 2. 协调并行工作树（worktrees）

同一个仓库开了多个 Git Worktree，每个 Worktree 一个 Claude Code 会话。某个会话完成关键改动后，可以主动通知其他会话，避免对方直到合并冲突时才发现。

### 3. 获取长任务状态

数据库迁移、批量测试、长时间构建跑在后台会话里。完成后台任务后，它可以主动发消息给你正在看的主会话；你也可以从主会话主动问后台会话”跑完了吗”。

### 4. 跨机器回复

如果你通过 Remote Control 连接了其他机器或手机上的 Claude Code 会话，收到消息后可以在本地回复。注意：**跨机器只能回复，不能主动发起新对话。**

---

## 三、底层是怎么实现的？

Claude Code 通过两个新工具完成会话发现和消息发送，你**不需要手动调用它们**，Claude 会在合适的时机自己使用：

| 工具 | 作用 |
| --- | --- |
| `ListAgents` | 发现当前可以联系的会话、子智能体和远程会话 |
| `SendMessage` | 向指定名称的会话发送一条纯文本消息 |

同一个 `SendMessage` 工具也用于向当前会话内的子智能体（subagents）和 Agent Team 队友发消息，跨会话通信是把这个机制扩展到了你独立启动的会话之间。

消息内容非常轻量：

- 只发 Claude 写的纯文本摘要
- 包含发送方名称和一个回复地址
- **不会发送对话历史、文件、上下文或权限信息**

如果你真正想把一整个会话的完整上下文迁移到另一个终端，正确的做法是**恢复会话（/resume）**，而不是发消息。

---

## 四、如何使用？

### 第一步：确认版本和平台

跨会话通信需要：

- **Claude Code v2.1.224 或更高版本**
- **macOS 或 Linux**（包含 WSL 2）
- 暂不支持原生 Windows

检查版本：

```bash
claude --version
```

### 第二步：给会话命名

为了让 Claude 能准确找到目标会话，建议给每个会话起一个清晰的名字。命名有两种方式：

**启动时命名：**

```bash
claude --name migration
claude --name payments-api
```

**已启动的会话中重命名：**

```bash
/rename frontend-session
```

如果不命名，Claude Code 会根据工作目录生成一个默认名称，比如 `myapp-3f`，多个会话可能重名。

### 第三步：查看可联系的会话

在任意一个会话中输入：

```bash
/list-agents
```

别名：`/peers`

你会看到三类目标：

| 类型 | 说明 |
| --- | --- |
| 子智能体 | 当前会话内运行的 subagent |
| 本地会话 | 同一台机器上的其他 Claude Code 会话，包括后台会话 |
| 远程会话 | 通过 Remote Control 连接的其他设备或网页端会话，标记为 Remote Control |

### 第四步：让 Claude 发消息

你不需要自己写消息内容，直接告诉 Claude 你的意图即可。例如：

```
把刚才这个 API 改动通知给 payments-api 会话
``````
问问我另一个终端的 migration 会话跑完了没有
``````
把我们刚才做的事总结一下发给 frontend-session
```

Claude 会自动整理摘要、找到目标会话、发送消息。接收方的 Claude 会在当前工作回合的工具调用间隙读取消息，不会打断正在运行的工具；如果接收方空闲，Claude Code 会用这条消息开启一个新回合。

---

## 五、安全边界与限制

### 1. 不传递敏感内容

跨会话消息只包含纯文本摘要，**不会发送完整对话记录、文件内容、系统权限或项目配置**。如果你希望迁移完整上下文，请用 `/resume` 恢复会话。

### 2. 不能替你授权

来自其他会话的消息**永远不会被视为你的同意**。它不能批准权限请求、不能修改 `CLAUDE.md`、不能更改会话配置。如果接收方需要根据消息执行操作，仍会弹出正常的权限提示，由你决定是否允许。

### 3. 入站消息可控

通过 `crossSessionInbound` 设置，你可以控制接收策略：

| 策略 | 行为 |
| --- | --- |
| `accept` | 直接接收并交给 Claude 处理 |
| `hold` | 消息暂存，等待你手动审批 |
| `refuse` | 直接丢弃所有跨会话消息 |

默认行为会依据收发双方的权限模式自动判断：如果接收会话处于绕过权限（bypass permissions）模式，来自普通会话的消息会被 hold 住等待审批，避免高风险会话被悄悄操控。

### 4. 平台与传输限制

- 同一台机器上的会话通过**本地 Unix socket** 通信，数据不经过 Anthropic 服务器。
- 跨机器 / 跨网页回复需通过 Remote Control，且**只能回复，不能主动发起**。
- 托管平台如 Amazon Bedrock、Google Cloud Agent Platform、Microsoft Foundry 暂不支持该功能。

### 5. 频率与容量限制

- 单个会话最多暂存 100 条被 hold 的消息，超出后最旧的消息会被丢弃。
- 系统内置消息频率限流与去重机制，防止循环刷屏。
- 审批对话框默认 5 分钟过期。

---

## 六、与子智能体、Agent Team 的区别

Claude Code 里有三种多会话/多智能体协作方式，容易混淆：

| 方式 | 关系 | 适用场景 |
| --- | --- | --- |
| 子智能体（Subagents） | 父子关系，Claude 在当前会话内临时创建的 worker | 一次性任务，做完返回结果 |
| Agent Team | Claude 创建并管理的队友 | 复杂任务内部协作 |
| 跨会话消息 | 对等关系，你自己独立启动的多个会话互相通信 | 多终端、多 Worktree、长任务协同 |

关键区别：**跨会话通信连接的是你主动打开的独立会话，而不是 Claude 帮你创建和管理的智能体。**

---

## 七、实际操作建议

1. **养成命名习惯**：多开会话时第一时间用 `--name` 或 `/rename` 命名，避免目标混乱。
2. **明确表达意图**：你不需要写消息正文，告诉 Claude”通知另一个会话什么”即可。
3. **敏感环境收紧入站策略**：在 CI/生产相关会话中，把 `crossSessionInbound` 设为 `hold` 或 `refuse`。
4. **不要替代 resume**：想继续同一个对话，用 `/resume`；只传递一个结论或状态，用跨会话消息。
5. **关注版本更新**：Windows 支持、跨机器主动发信等功能可能会在后续版本补齐。

---

## 八、相关资源

| 资源 | 链接 |
| --- | --- |
| 官方文档：Cross-session Messaging | <https://code.claude.com/docs/en/cross-session-messaging> |
| 官方 Changelog | <https://code.claude.com/docs/en/changelog> |

---

## 结语

Claude Code 的跨会话通信，看起来只是”会话之间能发消息”，实际上解决的是 AI 编程工作流里一个长期存在的痛点：**多终端并行时的上下文接力**。

它不会让你不再需要多个终端，但会让你在多个终端之间少复制粘贴很多次。对于习惯同时跑多个 Claude Code 会话的开发者来说，这个功能几乎是开箱即用、零配置生效的。

只要你的版本够新、平台支持，明天打开两个终端起两个名字，就可以试试让它自己”传话”了。

---

*内容整理自 Anthropic 官方文档、Claude Code Changelog 及公开报道。*
