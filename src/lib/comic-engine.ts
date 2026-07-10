import {
  ART_STYLES as COMIC_ART_STYLES,
  TONES as COMIC_TONES,
  LAYOUTS as COMIC_LAYOUTS,
  PRESETS as COMIC_PRESETS,
  COMIC_BASE_PROMPT,
  STORYBOARD_TEMPLATE as COMIC_STORYBOARD_TEMPLATE,
  ArtStyle as ArtStyleDef,
  Tone as ToneDef,
  Layout as LayoutDef,
  Preset as PresetDef,
} from './comic-data';

const LLM_API_URL = process.env.AGNES_API_BASE_URL ?? 'https://apihub.agnes-ai.com/v1';
const LLM_API_KEY = process.env.AGNES_API_KEY ?? '';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callLLM(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${LLM_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'agnes-2.0-flash',
      messages,
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LLM API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ─── Robust JSON extraction ──────────────────────────────────────────────────

function extractJSON<T>(raw: string): T {
  let text = raw.trim();

  // Strip markdown code fences ```json ... ``` or ``` ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  // Try direct parse first
  try {
    return JSON.parse(text) as T;
  } catch {
    // Fall through to extraction
  }

  // Scan for balanced braces/brackets (handles strings with nested quotes)
  const tryExtract = (open: string, close: string): string | null => {
    let depth = 0;
    let start = -1;
    let inString = false;
    let escape = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;

      if (ch === open) {
        if (depth === 0) start = i;
        depth++;
      } else if (ch === close) {
        depth--;
        if (depth === 0 && start >= 0) return text.slice(start, i + 1);
      }
    }
    return null;
  };

  const objMatch = tryExtract('{', '}');
  if (objMatch) {
    try { return JSON.parse(objMatch) as T; } catch {}
  }

  const arrMatch = tryExtract('[', ']');
  if (arrMatch) {
    try { return JSON.parse(arrMatch) as T; } catch {}
  }

  // Last resort: old regex
  const objRegex = text.match(/\{[\s\S]*\}/);
  if (objRegex) {
    try { return JSON.parse(objRegex[0]) as T; } catch {}
  }

  const arrRegex = text.match(/\[[\s\S]*\]/);
  if (arrRegex) {
    try { return JSON.parse(arrRegex[0]) as T; } catch {}
  }

  throw new Error(`Failed to parse JSON from LLM response. First 200 chars: ${text.slice(0, 200)}`);
}

// ─── Step 1: Analyze Content ──────────────────────────────────────────────────

export interface ComicAnalysis {
  topic: string;
  genre: string;
  audience: string;
  complexity: string;
  sourceLanguage: string;
  keyThemes: string[];
  suggestedFocus: string;
}

export async function analyzeComicContent(userInput: string): Promise<ComicAnalysis> {
  const systemPrompt = `You are a comic content analyst. Analyze the given content for creating an educational/knowledge comic. Return a JSON object with:
- topic: main topic (in the content's language)
- genre: comic genre (e.g., "传记", "科普", "教程", "历史", "科学", "哲学")
- audience: target audience
- complexity: complexity level (简单/中等/复杂)
- sourceLanguage: detected language (zh/en/ja/etc)
- keyThemes: array of 3-6 key themes
- suggestedFocus: what aspect to emphasize in the comic

Return ONLY the JSON object, no markdown fences.`;

  const result = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput },
  ]);

  return extractJSON<ComicAnalysis>(result);
}

// ─── Step 2: Recommend Combinations ───────────────────────────────────────────

export interface ComicCombo {
  presetId?: string;
  artId: string;
  artName: string;
  toneId: string;
  toneName: string;
  layoutId: string;
  layoutName: string;
  rationale: string;
}

export async function recommendComicCombos(
  analysis: ComicAnalysis,
): Promise<ComicCombo[]> {
  const artOptions = COMIC_ART_STYLES.map(a => `${a.id}: ${a.name} — ${a.description}`).join('\n');
  const toneOptions = COMIC_TONES.map(t => `${t.id}: ${t.name} — ${t.description}`).join('\n');
  const layoutOptions = COMIC_LAYOUTS.map(l => `${l.id}: ${l.name} — ${l.description}`).join('\n');
  const presetOptions = COMIC_PRESETS.map(p => `${p.id}: ${p.name} — ${p.description}`).join('\n');

  const systemPrompt = `You are a comic design consultant. Based on the content analysis, recommend 3-5 art×tone×layout combinations for a knowledge comic.

Available art styles:
${artOptions}

Available tones:
${toneOptions}

Available layouts:
${layoutOptions}

Available presets (special combinations with extra rules):
${presetOptions}

Return a JSON array of objects with:
- presetId: preset id if using a preset, otherwise null
- artId: art style id
- artName: art style display name
- toneId: tone id
- toneName: tone display name
- layoutId: layout id
- layoutName: layout display name
- rationale: brief explanation (in the content's language)

Consider: content genre → matching art style, tone → matching mood, audience → matching layout complexity.

Return ONLY the JSON array, no markdown fences.`;

  const result = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analysis:\n${JSON.stringify(analysis, null, 2)}` },
  ]);

  return extractJSON<ComicCombo[]>(result);
}

// ─── Step 3: Generate Storyboard ──────────────────────────────────────────────

export interface ComicPage {
  pageNumber: number;
  type: 'cover' | 'page';
  title: string;
  description: string;
  panels: {
    panelNumber: number;
    description: string;
    dialogue: string[];
    narration: string;
    visualNotes: string;
  }[];
  characters: string[];
}

export interface Storyboard {
  title: string;
  pageCount: number;
  pages: ComicPage[];
  characters: {
    name: string;
    description: string;
    appearance: string;
    personality: string;
  }[];
}

export async function generateStoryboard(
  userInput: string,
  analysis: ComicAnalysis,
  artId: string,
  toneId: string,
  layoutId: string,
  language: string,
): Promise<Storyboard> {
  const art = COMIC_ART_STYLES.find(a => a.id === artId);
  const tone = COMIC_TONES.find(t => t.id === toneId);
  const layout = COMIC_LAYOUTS.find(l => l.id === layoutId);

  const systemPrompt = `You are a comic storyboard writer. Create a storyboard for a knowledge comic based on the given content.

Art style: ${art?.name} — ${art?.description}
Tone: ${tone?.name} — ${tone?.description}
Layout: ${layout?.name} — ${layout?.description}
Language: ${language}

Rules:
- Create 4-8 pages (including cover)
- First page is the cover
- Each page has 2-4 panels depending on layout
- Preserve source data faithfully — no fabricating facts
- Keep dialogue concise and natural
- Include narration where needed for context
- All text in ${language}

Return a JSON object with:
- title: comic title (in ${language})
- pageCount: total page count
- characters: array of { name, description, appearance, personality }
- pages: array of {
    pageNumber, type ("cover"|"page"), title,
    description: page scene description,
    panels: array of { panelNumber, description, dialogue (string[]), narration, visualNotes }
  }

Return ONLY the JSON object, no markdown fences.`;

  const result = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nContent:\n${userInput}` },
  ]);

  const storyboard = extractJSON<Storyboard>(result);

  // Defensive validation
  if (!storyboard.pages || !Array.isArray(storyboard.pages) || storyboard.pages.length === 0) {
    // Try to find pages under alternative keys
    const raw = result.trim();
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const text = fenceMatch ? fenceMatch[1].trim() : raw;
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || text);
    const pages = parsed.pages || parsed.Pages || parsed.page || parsed.Page;
    if (pages && Array.isArray(pages) && pages.length > 0) {
      return { ...parsed, pages } as Storyboard;
    }
    throw new Error(`Storyboard missing pages field. LLM returned: ${text.slice(0, 300)}`);
  }

  return storyboard;
}

// ─── Step 5: Build Final Prompt for a Page ────────────────────────────────────

export function buildComicPagePrompt(
  page: ComicPage,
  characters: Storyboard['characters'],
  artId: string,
  toneId: string,
  layoutId: string,
  aspectRatio: string,
  language: string,
): string {
  const art = COMIC_ART_STYLES.find(a => a.id === artId);
  const tone = COMIC_TONES.find(t => t.id === toneId);
  const layout = COMIC_LAYOUTS.find(l => l.id === layoutId);

  const charDescriptions = (characters ?? []).map(c =>
    `- ${c.name}: ${c.appearance ?? ''}. ${c.personality ?? ''}`
  ).join('\n');

  const panelDescriptions = (page.panels ?? []).map(p => {
    const dialogue = (p.dialogue && p.dialogue.length > 0) ? `\n    Dialogue: ${p.dialogue.join(' / ')}` : '';
    const narration = p.narration ? `\n    Narration: ${p.narration}` : '';
    return `  Panel ${p.panelNumber}: ${p.description ?? ''}${dialogue}${narration}\n    Visual: ${p.visualNotes ?? ''}`;
  }).join('\n');

  const prompt = `Create a knowledge comic page with the following specifications:

## Art Style
${art?.name ?? 'Ligne Claire'}
${art?.guidelines ?? ''}

## Tone
${tone?.name ?? 'Neutral'}
${tone?.guidelines ?? ''}

## Layout
${layout?.name ?? 'Standard'}
${layout?.guidelines ?? ''}

## Page Info
- Page Number: ${page.pageNumber}
- Page Type: ${page.type}
- Title: ${page.title}
- Aspect Ratio: ${aspectRatio}
- Language: ${language}

## Characters
${charDescriptions || 'No recurring characters'}

## Scene Description
${page.description ?? ''}

## Panels
${panelDescriptions || 'Single page illustration'}

## Rendering Rules
- Follow the art style guidelines precisely
- Apply tone/mood consistently
- Maintain character consistency
- Clear panel borders with white gutters
- Hand-lettered style text in speech bubbles and narration boxes
- All text in ${language}

${COMIC_BASE_PROMPT}`;

  return prompt;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getArtStyleById(id: string): ArtStyleDef | undefined {
  return COMIC_ART_STYLES.find(a => a.id === id);
}

export function getToneById(id: string): ToneDef | undefined {
  return COMIC_TONES.find(t => t.id === id);
}

export function getLayoutById(id: string): LayoutDef | undefined {
  return COMIC_LAYOUTS.find(l => l.id === id);
}

export function getPresetById(id: string): PresetDef | undefined {
  return COMIC_PRESETS.find(p => p.id === id);
}

export { COMIC_ART_STYLES, COMIC_TONES, COMIC_LAYOUTS, COMIC_PRESETS };
