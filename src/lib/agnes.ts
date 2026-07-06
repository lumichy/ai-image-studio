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
      extra_body: { response_format: 'url' },
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

  // Upload the base64 image to a temp host to get a public URL
  const imageUrl = await uploadImageToTempHost(referenceImage);

  // Agnes API: image-to-image uses /images/generations with extra_body.image array
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
      extra_body: {
        response_format: 'url',
        image: [imageUrl],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

/**
 * Upload a base64 image to uguu.se temporary host and return the public URL.
 * The URL is valid for ~48 hours.
 */
async function uploadImageToTempHost(base64Data: string): Promise<string> {
  // Strip data URL prefix if present
  const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const buffer = Buffer.from(base64, 'base64');

  const formData = new FormData();
  const blob = new Blob([buffer], { type: 'image/png' });
  formData.append('files[]', blob, 'reference.png');

  const response = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.status}`);
  }

  const data = await response.json();
  return data.url;
}
