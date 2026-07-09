import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeContent,
  generateStructuredContent,
  recommendCombinations,
  buildInfographicPrompt,
} from '@/lib/infographic-engine';

export async function POST(request: NextRequest) {
  try {
    const { prompt: userInput, layoutId, styleId, aspectRatio } = await request.json();

    if (!userInput || !layoutId || !styleId) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt, layoutId, styleId' },
        { status: 400 },
      );
    }

    // Step 1: Analyze content
    const analysis = await analyzeContent(userInput);

    // Step 2: Generate structured content
    const structured = await generateStructuredContent(userInput, analysis);

    // Step 3: If user chose "recommend", use LLM to pick layout/style
    let finalLayoutId = layoutId;
    let finalStyleId = styleId;

    if (layoutId === '__recommend__' || styleId === '__recommend__') {
      const combos = await recommendCombinations(analysis, structured);
      if (combos.length > 0) {
        const best = combos[0];
        if (layoutId === '__recommend__') finalLayoutId = best.layoutId;
        if (styleId === '__recommend__') finalStyleId = best.styleId;
      } else {
        // Fallback defaults
        if (layoutId === '__recommend__') finalLayoutId = 'bento-grid';
        if (styleId === '__recommend__') finalStyleId = 'craft-handmade';
      }
    }

    // Step 5: Build final prompt from base-prompt template + layout/style guidelines
    const fullPrompt = await buildInfographicPrompt(
      finalLayoutId,
      finalStyleId,
      aspectRatio || '16:9',
      analysis.sourceLanguage || 'zh',
      structured,
    );

    // Step 6: Generate image via Agnes API
    const aspectToSize: Record<string, string> = {
      '16:9': '1024x576',
      '9:16': '576x1024',
      '1:1': '1024x1024',
    };
    const size = aspectToSize[aspectRatio || '16:9'] ?? '1024x576';

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
    const imageUrl = data.data[0].url;

    return NextResponse.json({
      imageUrl,
      fullPrompt,
      recommendedLayout: layoutId === '__recommend__' ? finalLayoutId : undefined,
      recommendedStyle: styleId === '__recommend__' ? finalStyleId : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
