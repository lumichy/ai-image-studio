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

  const body: Record<string, unknown> = {
    model: 'agnes-image-2.1-flash',
    prompt: fullPrompt,
    extra_body: { response_format: 'url' },
  };
  if (size) body.size = size;

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
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
  const body: Record<string, unknown> = {
    model: 'agnes-image-2.1-flash',
    prompt: fullPrompt,
    extra_body: {
      response_format: 'url',
      image: [imageUrl],
    },
  };
  if (size) body.size = size;

  const response = await fetch(`${API_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agnes API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

/**
 * Upload a base64 image to a temporary host and return the public URL.
 * Tries uguu.se first (Agnes can reliably fetch it), then tmpfiles.org as fallback.
 * URLs are temporary (~48h on uguu, ~1h on tmpfiles).
 */
async function uploadImageToTempHost(base64Data: string): Promise<string> {
  // Strip data URL prefix if present
  const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const buffer = Buffer.from(base64, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });

  // Try uguu.se first
  try {
    const formData = new FormData();
    formData.append('files[]', blob, 'reference.png');

    const response = await fetch('https://uguu.se/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      // uguu.se response: { files: [{ url: "https://..." }] }
      const url = data.files?.[0]?.url;
      if (url) return url;
    }
  } catch {
    // Fall through to tmpfiles.org
  }

  // Fallback: tmpfiles.org
  const formData2 = new FormData();
  const blob2 = new Blob([buffer], { type: 'image/png' });
  formData2.append('file', blob2, 'reference.png');

  const response2 = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData2,
  });

  if (!response2.ok) {
    throw new Error(`Failed to upload image to all temp hosts`);
  }

  const data2 = await response2.json();
  // tmpfiles.org response: { data: { url: "https://tmpfiles.org/xxx" } }
  // Convert viewer URL to direct download URL
  const viewerUrl: string = data2.data?.url ?? '';
  const directUrl = viewerUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

  if (!directUrl) {
    throw new Error('Failed to get URL from tmpfiles.org response');
  }

  return directUrl;
}
