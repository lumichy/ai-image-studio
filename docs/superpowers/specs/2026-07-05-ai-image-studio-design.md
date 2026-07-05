# AI Image Studio - 设计文档

**日期：** 2026-07-05
**状态：** 已批准

## 概述

一个基于 AI 的图片生成网站，面向普通消费者。用户输入文字描述，选择风格和尺寸，即可生成图片并下载。支持文生图和图生图两种模式。

## 技术栈

- **前端 + 后端：** Next.js 14+ (App Router) 全栈一体
- **语言：** TypeScript
- **样式：** Tailwind CSS
- **AI 服务：** Agnes AI (apihub.agnes-ai.com)
- **部署：** 本地自用

## 架构

```
浏览器 → Next.js 应用 (端口 3000) → Agnes AI API
         前端页面 + API Routes        apihub.agnes-ai.com/v1
```

- 前端页面：文生图 / 图生图界面
- API Routes：代理 Agnes AI，隐藏 API Key
- 无数据库，无图片存储，生成即返回

## 功能清单

| 功能 | 说明 |
|------|------|
| 文生图 | 用户输入 Prompt → 选择风格 → 选择尺寸 → 生成图片 |
| 图生图 | 上传参考图 + Prompt → 选择风格 → 选择尺寸 → 生成图片 |
| 风格预设 | 6 种预设风格，点击自动拼接到 prompt |
| 尺寸选择 | 4 种比例可选 |
| 图片下载 | 生成后可下载到本地 |
| 加载状态 | 生成中显示 loading 动画 |

## 不包含的功能

- 用户注册/登录（免登录直接用）
- 图片存储/历史记录（不保存）
- 社交功能
- 批量生成

## 页面设计

```
┌─────────────────────────────────────────────┐
│  AI 生图工作室          [Agnes AI]           │
├─────────────────────────────────────────────┤
│  [文生图]  [图生图]                          │
│                                             │
│  ┌─ 左侧：参数面板 ───┐  ┌─ 右侧：结果区 ─┐ │
│  │  Prompt 输入框     │  │  生成的图片    │ │
│  │  风格选择          │  │  预览          │ │
│  │  尺寸选择          │  │  [下载] 按钮   │ │
│  │  [图生图] 参考图   │  │                │ │
│  │  [生成] 按钮       │  │                │ │
│  └────────────────────┘  └────────────────┘ │
└─────────────────────────────────────────────┘
```

## API 路由

### POST /api/generate/text-to-image

**请求：**
```json
{
  "prompt": "一只猫坐在窗台上",
  "style": "anime",
  "size": "1024x1024"
}
```

**流程：**
1. 拼接风格后缀到 prompt
2. 调用 Agnes API: `POST https://apihub.agnes-ai.com/v1/images/generations`
3. 返回图片 URL

**Agnes API 调用参数：**
```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "拼接后的完整 prompt",
  "size": "1024x1024"
}
```

### POST /api/generate/image-to-image

**请求：**
```json
{
  "prompt": "换成赛博朋克风格",
  "referenceImage": "base64 编码的图片",
  "style": "cyberpunk",
  "size": "1024x1024"
}
```

**流程：**
1. 拼接风格后缀到 prompt
2. 调用 Agnes API: `POST https://apihub.agnes-ai.com/v1/images/edits`
3. 返回图片 URL

**Agnes API 调用参数：**
```json
{
  "model": "agnes-image-2.0-flash",
  "prompt": "拼接后的完整 prompt",
  "image": "base64 图片数据",
  "size": "1024x1024"
}
```

### 错误处理

| 场景 | HTTP 状态码 | 说明 |
|------|------------|------|
| API Key 缺失 | 500 | 提示配置 .env.local |
| Agnes API 报错 | 透传 | 返回 Agnes 的错误信息 |
| 网络超时 | 504 | 提示重试 |

## 风格预设

| 风格 | 标识 | Prompt 后缀 |
|------|------|-------------|
| 动漫 | anime | `anime style, vibrant colors, detailed illustration` |
| 写实 | realistic | `photorealistic, high detail, 8k` |
| 油画 | oil-painting | `oil painting, thick brush strokes, canvas texture` |
| 赛博朋克 | cyberpunk | `cyberpunk style, neon lights, futuristic, dark atmosphere` |
| 水彩 | watercolor | `watercolor painting, soft colors, artistic brush strokes` |
| 摄影 | photography | `professional photography, natural lighting, shallow depth of field` |

**拼接逻辑：** `最终 prompt = 用户输入 + ", " + 风格后缀`

## 尺寸映射

| 比例 | 尺寸 |
|------|------|
| 1:1 | 1024x1024 |
| 16:9 | 1024x576 |
| 9:16 | 576x1024 |
| 4:3 | 1024x768 |

## 目录结构

```
ai-image-studio/
├── package.json
├── next.config.js
├── .env.local                  # AGNES_API_KEY
├── .gitignore
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页面
│   │   ├── globals.css         # 全局样式
│   │   └── api/
│   │       └── generate/
│   │           ├── text-to-image/
│   │           │   └── route.ts
│   │           └── image-to-image/
│   │               └── route.ts
│   ├── components/
│   │   ├── PromptInput.tsx
│   │   ├── StyleSelector.tsx
│   │   ├── SizeSelector.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── ModeSwitch.tsx
│   ├── lib/
│   │   ├── agnes.ts            # Agnes API 封装
│   │   └── constants.ts        # 风格/尺寸常量
│   └── types/
│       └── index.ts            # TypeScript 类型定义
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-07-05-ai-image-studio-design.md
```

## 环境配置

```bash
# .env.local
AGNES_API_KEY=sk-your-api-key
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1
```

## 启动方式

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```
