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
