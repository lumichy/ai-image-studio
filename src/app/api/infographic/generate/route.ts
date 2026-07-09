import { NextRequest, NextResponse } from 'next/server';
import { buildInfographicPrompt } from '@/lib/infographic-engine';
import { generateInfographic } from '@/lib/agnes';

export async function POST(request: NextRequest) {
  try {
    const { structured, layoutId, styleId, aspectRatio, language } = await request.json();

    if (!structured || !layoutId || !styleId) {
      return NextResponse.json(
        { error: '缺少必要参数: structured, layoutId, styleId' },
        { status: 400 },
      );
    }

    // Step 5: Build the final prompt using base-prompt template + layout/style guidelines
    const fullPrompt = await buildInfographicPrompt(
      layoutId,
      styleId,
      aspectRatio || '16:9',
      language || 'zh',
      structured,
    );

    // Step 6: Generate image via Agnes API
    const aspectToSize: Record<string, string> = {
      '16:9': '1024x576',
      '9:16': '576x1024',
      '1:1': '1024x1024',
    };
    const size = aspectToSize[aspectRatio] ?? '1024x576';

    const { url } = await generateInfographicRaw(fullPrompt, size);

    return NextResponse.json({ imageUrl: url, fullPrompt });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Wrapper: call Agnes with a raw prompt (bypasses the simple template in generateInfographic)
async function generateInfographicRaw(fullPrompt: string, size: string): Promise<{ url: string }> {
  const API_BASE_URL = process.env.AGNES_API_BASE_URL ?? 'https://apihub.agnes-ai.com/v1';
  const API_KEY = process.env.AGNES_API_KEY;

  const body: Record<string, unknown> = {
    model: 'agnes-image-2.1-flash',
    prompt: fullPrompt,
    size,
    extra_body: { response_format: 'url' },
  };

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
  return { url: data.data[0].url };
}
