import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, generateStructuredContent, recommendCombinations } from '@/lib/infographic-engine';

export async function POST(request: NextRequest) {
  try {
    const { prompt: userInput } = await request.json();

    if (!userInput) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt' },
        { status: 400 },
      );
    }

    // Step 1: Analyze content
    const analysis = await analyzeContent(userInput);

    // Step 2: Generate structured content
    const structured = await generateStructuredContent(userInput, analysis);

    // Step 3: Recommend combinations
    const combos = await recommendCombinations(analysis, structured);

    return NextResponse.json({
      analysis,
      structured,
      combos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '分析失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
