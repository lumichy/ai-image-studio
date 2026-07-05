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
