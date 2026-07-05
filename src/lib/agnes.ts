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
