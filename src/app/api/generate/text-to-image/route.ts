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
