import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, generateStructuredContent, buildInfographicPrompt, ContentAnalysis, StructuredContent } from '@/lib/infographic-engine';

export async function POST(request: NextRequest) {
  try {
    const { prompt: userInput, layoutId, styleId, aspectRatio, analysis: cachedAnalysis, structured: cachedStructured } = await request.json();

    if (!userInput || !layoutId || !styleId) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt, layoutId, styleId' },
        { status: 400 },
      );
    }

    // Step 1: Analyze content (skip if cached)
    const analysis: ContentAnalysis = cachedAnalysis ?? await analyzeContent(userInput);

    // Step 2: Generate structured content (skip if cached)
    const structured: StructuredContent = cachedStructured ?? await generateStructuredContent(userInput, analysis);

    // Step 3: Build final prompt from base-prompt template + layout/style guidelines
    const fullPrompt = await buildInfographicPrompt(
      layoutId,
      styleId,
      aspectRatio || '16:9',
      analysis.sourceLanguage || 'zh',
      structured,
    );

    // Step 4: Generate image via Agnes API
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

    return NextResponse.json({ imageUrl, fullPrompt });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
