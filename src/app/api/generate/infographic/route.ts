import { NextRequest, NextResponse } from 'next/server';
import { generateInfographic } from '@/lib/agnes';

export async function POST(request: NextRequest) {
  try {
    const { prompt, layout, style, aspect } = await request.json();

    if (!prompt || !layout || !style) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt, layout, style' },
        { status: 400 },
      );
    }

    const imageUrl = await generateInfographic(prompt, layout, style, aspect || 'landscape');
    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
