# Task 2 Report: Constants & Types

## Status: DONE

## What was done

Created the TypeScript type definitions and constants files as specified in the plan.

### Files created

1. **`src/types/index.ts`** — Shared TypeScript types:
   - `GenerateMode` — union type `'text-to-image' | 'image-to-image'`
   - `StylePreset` — interface for style presets (id, label, promptSuffix)
   - `SizeOption` — interface for size options (id, label, ratio, dimensions)
   - `TextToImageRequest` — request body shape for T2I
   - `ImageToImageRequest` — request body shape for I2I
   - `GenerateResponse` — response shape with imageUrl and optional error

2. **`src/lib/constants.ts`** — Style/size config and helpers:
   - `STYLE_PRESETS` — 6 style presets (anime, realistic, oil-painting, cyberpunk, watercolor, photography)
   - `SIZE_OPTIONS` — 4 size options (square 1:1, landscape 16:9, portrait 9:16, standard 4:3)
   - `buildPrompt(userPrompt, styleId)` — appends style prompt suffix to user prompt
   - `getDimensions(sizeId)` — returns dimensions string, defaults to `1024x1024`

### Verification

- `npx tsc --noEmit` — passed, zero errors
- Files match the plan specification exactly

### Commit

- `cad3834` — `feat: add types and style/size constants`
