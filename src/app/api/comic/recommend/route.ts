import { NextRequest, NextResponse } from 'next/server';
import { analyzeComicContent, recommendComicCombos } from '@/lib/comic-engine';

export async function POST(request: NextRequest) {
  try {
    const { prompt: userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json({ error: '缺少参数: prompt' }, { status: 400 });
    }

    const analysis = await analyzeComicContent(userInput);
    const combos = await recommendComicCombos(analysis);

    return NextResponse.json({ analysis, combos });
  } catch (error) {
    const message = error instanceof Error ? error.message : '推荐失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
