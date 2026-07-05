# AI Image Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local AI image generation web app using Next.js + Agnes AI API, supporting text-to-image and image-to-image with style presets and size selection.

**Architecture:** Next.js 14+ App Router full-stack app. Frontend pages call API Routes which proxy to Agnes AI. No database, no image storage. Single `npm run dev` to run.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Agnes AI API (OpenAI-compatible)

## Global Constraints

- Agnes API Key stored in `.env.local` as `AGNES_API_KEY`
- Agnes API Base URL: `https://apihub.agnes-ai.com/v1`
- Text-to-image model: `agnes-image-2.1-flash`
- Image-to-image model: `agnes-image-2.0-flash`
- No user auth, no database, no image storage
- All UI text in Chinese
- Prompt style suffixes appended in English

---

## File Structure

```
ai-image-studio/
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── .env.local
├── .env.example
├── .gitignore
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with Tailwind
│   │   ├── page.tsx                # Main page composing all components
│   │   ├── globals.css             # Tailwind directives
│   │   └── api/
│   │       └── generate/
│   │           ├── text-to-image/
│   │           │   └── route.ts    # T2I API route
│   │           └── image-to-image/
│   │               └── route.ts    # I2I API route
│   ├── components/
│   │   ├── ModeSwitch.tsx          # T2I/I2I tab switcher
│   │   ├── PromptInput.tsx         # Prompt textarea
│   │   ├── StyleSelector.tsx       # Style preset buttons
│   │   ├── SizeSelector.tsx        # Size ratio buttons
│   │   ├── ImageUpload.tsx         # Reference image upload (I2I mode)
│   │   ├── ResultDisplay.tsx       # Generated image preview + download
│   │   └── GenerateButton.tsx      # Generate button with loading state
│   ├── lib/
│   │   ├── agnes.ts                # Agnes API client wrapper
│   │   └── constants.ts            # Styles & sizes config
│   └── types/
│       └── index.ts                # Shared TypeScript types
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `.env.local`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`

**Interfaces:**
- Produces: A running Next.js dev server at `http://localhost:3000` with Tailwind CSS configured

- [ ] **Step 1: Create package.json**

```json
{
  "name": "ai-image-studio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
.next/
.env.local
*.log
```

- [ ] **Step 7: Create .env.example**

```bash
# Agnes AI API Key - 从 https://platform.agnes-ai.com 获取
AGNES_API_KEY=sk-your-api-key-here
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1
```

- [ ] **Step 8: Create .env.local**

```bash
AGNES_API_KEY=sk-your-api-key-here
AGNES_API_BASE_URL=https://apihub.agnes-ai.com/v1
```

- [ ] **Step 9: Create src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 10: Create src/app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 生图工作室',
  description: '基于 Agnes AI 的图片生成工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
```

- [ ] **Step 11: Create src/app/page.tsx**

```tsx
export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI 生图工作室</h1>
      <p className="text-center text-gray-500">正在加载...</p>
    </main>
  );
}
```

- [ ] **Step 12: Install dependencies**

Run: `cd ai-image-studio && npm install`
Expected: dependencies installed successfully

- [ ] **Step 13: Verify dev server starts**

Run: `npm run dev`
Expected: Server running at http://localhost:3000, page shows "AI 生图工作室"

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind CSS"
```

---

### Task 2: Constants & Types

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/constants.ts`

**Interfaces:**
- Produces: `StylePreset`, `SizeOption` types and their constant arrays `STYLE_PRESETS`, `SIZE_OPTIONS`
- Produces: `GenerateMode` type (`'text-to-image' | 'image-to-image'`)

- [ ] **Step 1: Create src/types/index.ts**

```ts
export type GenerateMode = 'text-to-image' | 'image-to-image';

export interface StylePreset {
  id: string;
  label: string;
  promptSuffix: string;
}

export interface SizeOption {
  id: string;
  label: string;
  ratio: string;
  dimensions: string;
}

export interface TextToImageRequest {
  prompt: string;
  style: string;
  size: string;
}

export interface ImageToImageRequest {
  prompt: string;
  referenceImage: string;
  style: string;
  size: string;
}

export interface GenerateResponse {
  imageUrl: string;
  error?: string;
}
```

- [ ] **Step 2: Create src/lib/constants.ts**

```ts
import { StylePreset, SizeOption } from '@/types';

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'anime', label: '动漫', promptSuffix: 'anime style, vibrant colors, detailed illustration' },
  { id: 'realistic', label: '写实', promptSuffix: 'photorealistic, high detail, 8k' },
  { id: 'oil-painting', label: '油画', promptSuffix: 'oil painting, thick brush strokes, canvas texture' },
  { id: 'cyberpunk', label: '赛博朋克', promptSuffix: 'cyberpunk style, neon lights, futuristic, dark atmosphere' },
  { id: 'watercolor', label: '水彩', promptSuffix: 'watercolor painting, soft colors, artistic brush strokes' },
  { id: 'photography', label: '摄影', promptSuffix: 'professional photography, natural lighting, shallow depth of field' },
];

export const SIZE_OPTIONS: SizeOption[] = [
  { id: 'square', label: '1:1', ratio: '方形', dimensions: '1024x1024' },
  { id: 'landscape', label: '16:9', ratio: '横版', dimensions: '1024x576' },
  { id: 'portrait', label: '9:16', ratio: '竖版', dimensions: '576x1024' },
  { id: 'standard', label: '4:3', ratio: '标准', dimensions: '1024x768' },
];

export function buildPrompt(userPrompt: string, styleId: string): string {
  const style = STYLE_PRESETS.find((s) => s.id === styleId);
  if (!style) return userPrompt;
  return `${userPrompt}, ${style.promptSuffix}`;
}

export function getDimensions(sizeId: string): string {
  const size = SIZE_OPTIONS.find((s) => s.id === sizeId);
  return size?.dimensions ?? '1024x1024';
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add types and style/size constants"
```

---

### Task 3: Agnes API Client

**Files:**
- Create: `src/lib/agnes.ts`

**Interfaces:**
- Consumes: `buildPrompt`, `getDimensions` from `src/lib/constants.ts`
- Produces: `generateTextToImage(prompt, styleId, sizeId)`, `generateImageToImage(prompt, referenceImage, styleId, sizeId)`

- [ ] **Step 1: Create src/lib/agnes.ts**

```ts
import { buildPrompt, getDimensions } from './constants';

const API_BASE_URL = process.env.AGNES_API_BASE_URL ?? 'https://apihub.agnes-ai.com/v1';
const API_KEY = process.env.AGNES_API_KEY;

export async function generateTextToImage(
  prompt: string,
  styleId: string,
  sizeId: string,
): Promise<string> {
  const fullPrompt = buildPrompt(prompt, styleId);
  const size = getDimensions(sizeId);

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'agnes-image-2.1-flash',
      prompt: fullPrompt,
      size,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

export async function generateImageToImage(
  prompt: string,
  referenceImage: string,
  styleId: string,
  sizeId: string,
): Promise<string> {
  const fullPrompt = buildPrompt(prompt, styleId);
  const size = getDimensions(sizeId);

  const formData = new FormData();
  formData.append('model', 'agnes-image-2.0-flash');
  formData.append('prompt', fullPrompt);
  formData.append('size', size);

  // Convert base64 to blob
  const base64Data = referenceImage.split(',')[1] ?? referenceImage;
  const blob = base64ToBlob(base64Data, 'image/png');
  formData.append('image', blob, 'reference.png');

  const response = await fetch(`${API_BASE_URL}/images/edits`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const bytes = Buffer.from(base64, 'base64');
  return new Blob([bytes], { type: mimeType });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Agnes API client wrapper"
```

---

### Task 4: API Routes

**Files:**
- Create: `src/app/api/generate/text-to-image/route.ts`
- Create: `src/app/api/generate/image-to-image/route.ts`

**Interfaces:**
- Consumes: `generateTextToImage`, `generateImageToImage` from `src/lib/agnes.ts`
- Produces: `POST /api/generate/text-to-image`, `POST /api/generate/image-to-image`

- [ ] **Step 1: Create text-to-image route**

`src/app/api/generate/text-to-image/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { generateTextToImage } from '@/lib/agnes';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, size } = await request.json();

    if (!prompt || !style || !size) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt, style, size' },
        { status: 400 },
      );
    }

    const imageUrl = await generateTextToImage(prompt, style, size);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create image-to-image route**

`src/app/api/generate/image-to-image/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { generateImageToImage } from '@/lib/agnes';

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceImage, style, size } = await request.json();

    if (!prompt || !referenceImage || !style || !size) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt, referenceImage, style, size' },
        { status: 400 },
      );
    }

    const imageUrl = await generateImageToImage(prompt, referenceImage, style, size);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add text-to-image and image-to-image API routes"
```

---

### Task 5: UI Components

**Files:**
- Create: `src/components/ModeSwitch.tsx`
- Create: `src/components/PromptInput.tsx`
- Create: `src/components/StyleSelector.tsx`
- Create: `src/components/SizeSelector.tsx`
- Create: `src/components/ImageUpload.tsx`
- Create: `src/components/ResultDisplay.tsx`
- Create: `src/components/GenerateButton.tsx`

**Interfaces:**
- Consumes: `STYLE_PRESETS`, `SIZE_OPTIONS` from `src/lib/constants.ts`, `GenerateMode` from `src/types/index.ts`

- [ ] **Step 1: Create ModeSwitch.tsx**

```tsx
'use client';

import { GenerateMode } from '@/types';

interface ModeSwitchProps {
  mode: GenerateMode;
  onChange: (mode: GenerateMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          mode === 'text-to-image'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onChange('text-to-image')}
      >
        文生图
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          mode === 'image-to-image'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onChange('image-to-image')}
      >
        图生图
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create PromptInput.tsx**

```tsx
'use client';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        描述文本
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入你想要生成的图片描述，例如：一只猫坐在窗台上"
        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        maxLength={500}
      />
      <div className="text-right text-xs text-gray-400 mt-1">
        {value.length}/500
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create StyleSelector.tsx**

```tsx
'use client';

import { STYLE_PRESETS } from '@/lib/constants';

interface StyleSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        风格
      </label>
      <div className="grid grid-cols-3 gap-2">
        {STYLE_PRESETS.map((style) => (
          <button
            key={style.id}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === style.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onChange(style.id)}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create SizeSelector.tsx**

```tsx
'use client';

import { SIZE_OPTIONS } from '@/lib/constants';

interface SizeSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function SizeSelector({ selected, onChange }: SizeSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        尺寸
      </label>
      <div className="grid grid-cols-4 gap-2">
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size.id}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === size.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onChange(size.id)}
          >
            <div>{size.label}</div>
            <div className="text-xs opacity-70">{size.ratio}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create ImageUpload.tsx**

```tsx
'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        参考图片
      </label>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="参考图预览"
            className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
          />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            onClick={() => {
              setPreview(null);
              onUpload('');
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <span className="text-gray-400">点击上传参考图片</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Create ResultDisplay.tsx**

```tsx
'use client';

interface ResultDisplayProps {
  imageUrl: string | null;
  error: string | null;
}

export default function ResultDisplay({ imageUrl, error }: ResultDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {error ? (
        <div className="text-red-500 text-center">
          <p className="font-medium">生成失败</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : imageUrl ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={imageUrl}
            alt="生成结果"
            className="max-w-full max-h-[500px] rounded-lg shadow-lg"
          />
          <a
            href={imageUrl}
            download="generated-image.png"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            下载图片
          </a>
        </div>
      ) : (
        <div className="text-gray-300 text-center">
          <p className="text-lg">生成的图片将显示在这里</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Create GenerateButton.tsx**

```tsx
'use client';

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function GenerateButton({ onClick, loading, disabled }: GenerateButtonProps) {
  return (
    <button
      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          生成中...
        </span>
      ) : (
        '生成图片'
      )}
    </button>
  );
}
```

- [ ] **Step 8: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add all UI components"
```

---

### Task 6: Main Page Integration

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: all components from Task 5, API routes from Task 4

- [ ] **Step 1: Rewrite src/app/page.tsx**

```tsx
'use client';

import { useState } from 'react';
import ModeSwitch from '@/components/ModeSwitch';
import PromptInput from '@/components/PromptInput';
import StyleSelector from '@/components/StyleSelector';
import SizeSelector from '@/components/SizeSelector';
import ImageUpload from '@/components/ImageUpload';
import ResultDisplay from '@/components/ResultDisplay';
import GenerateButton from '@/components/GenerateButton';
import { GenerateMode } from '@/types';

export default function Home() {
  const [mode, setMode] = useState<GenerateMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('anime');
  const [size, setSize] = useState('square');
  const [referenceImage, setReferenceImage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const endpoint =
        mode === 'text-to-image'
          ? '/api/generate/text-to-image'
          : '/api/generate/image-to-image';

      const body =
        mode === 'text-to-image'
          ? { prompt, style, size }
          : { prompt, referenceImage, style, size };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const canGenerate =
    prompt.trim().length > 0 &&
    (mode === 'text-to-image' || referenceImage.length > 0);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-2">AI 生图工作室</h1>
      <p className="text-center text-gray-400 text-sm mb-8">Powered by Agnes AI</p>

      <ModeSwitch mode={mode} onChange={setMode} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧：参数面板 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <PromptInput value={prompt} onChange={setPrompt} />

          {mode === 'image-to-image' && (
            <ImageUpload onUpload={setReferenceImage} />
          )}

          <StyleSelector selected={style} onChange={setStyle} />
          <SizeSelector selected={size} onChange={setSize} />

          <GenerateButton
            onClick={handleGenerate}
            loading={loading}
            disabled={!canGenerate}
          />
        </div>

        {/* 右侧：结果区 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ResultDisplay imageUrl={imageUrl} error={error} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run dev server and verify page loads**

Run: `npm run dev`
Expected: Page loads at http://localhost:3000 with full UI (mode switch, prompt input, style/size selectors, generate button, result area)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: integrate all components into main page"
```

---

### Task 7: End-to-End Verification

**Files:**
- No new files

- [ ] **Step 1: Set a real Agnes API Key**

Edit `.env.local` and replace `sk-your-api-key-here` with a real API key from https://platform.agnes-ai.com

- [ ] **Step 2: Test text-to-image**

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Enter prompt: "一只猫坐在窗台上"
4. Select style: 动漫
5. Select size: 1:1
6. Click generate
7. Expected: Image appears in result area within ~10-30s

- [ ] **Step 3: Test image-to-image**

1. Switch to 图生图 mode
2. Upload a reference image
3. Enter prompt: "变成赛博朋克风格"
4. Select style: 赛博朋克
5. Click generate
6. Expected: Transformed image appears in result area

- [ ] **Step 4: Test error handling**

1. Clear prompt, click generate → button should be disabled
2. Set an invalid API key in `.env.local`, restart, try generate → error message shows

- [ ] **Step 5: Test download**

1. Generate an image
2. Click "下载图片"
3. Expected: Image downloads to local machine

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: end-to-end verification complete"
```
