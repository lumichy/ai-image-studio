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
