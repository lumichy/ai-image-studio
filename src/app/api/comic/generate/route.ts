import { NextRequest, NextResponse } from 'next/server';
import { analyzeComicContent, generateStoryboard, buildComicPagePrompt } from '@/lib/comic-engine';

const AGNES_API_BASE_URL = process.env.AGNES_API_BASE_URL ?? 'https://apihub.agnes-ai.com/v1';
const AGNES_API_KEY = process.env.AGNES_API_KEY;

const ASPECT_TO_SIZE: Record<string, string> = {
  '3:4': '768x1024',
  '4:3': '1024x768',
  '16:9': '1024x576',
};

export async function POST(request: NextRequest) {
  try {
    const { prompt: userInput, artId, toneId, layoutId, aspectRatio } = await request.json();

    if (!userInput || !artId || !toneId || !layoutId) {
      return NextResponse.json(
        { error: '缺少必要参数: prompt, artId, toneId, layoutId' },
        { status: 400 },
      );
    }

    // Step 1: Analyze content
    const analysis = await analyzeComicContent(userInput);
    const language = analysis.sourceLanguage || 'zh';
    const aspect = aspectRatio || '3:4';
    const size = ASPECT_TO_SIZE[aspect] ?? '768x1024';

    // Step 3: Generate storyboard
    const storyboard = await generateStoryboard(userInput, analysis, artId, toneId, layoutId, language);

    // Step 5: Build prompts and generate images for each page
    const pages = await Promise.all(
      storyboard.pages.map(async (page) => {
        const fullPrompt = buildComicPagePrompt(
          page,
          storyboard.characters,
          artId,
          toneId,
          layoutId,
          aspect,
          language,
        );

        // Step 6: Generate image via Agnes API
        const body: Record<string, unknown> = {
          model: 'agnes-image-2.1-flash',
          prompt: fullPrompt,
          size,
          extra_body: { response_format: 'url' },
        };

        const response = await fetch(`${AGNES_API_BASE_URL}/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AGNES_API_KEY}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Agnes API error (page ${page.pageNumber}): ${response.status} ${error}`);
        }

        const data = await response.json();
        return {
          pageNumber: page.pageNumber,
          type: page.type,
          title: page.title,
          imageUrl: data.data[0].url,
          fullPrompt,
        };
      }),
    );

    return NextResponse.json({
      title: storyboard.title,
      pageCount: storyboard.pageCount,
      pages,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
