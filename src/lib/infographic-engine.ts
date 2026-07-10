import { INFOGRAPHIC_LAYOUTS, INFOGRAPHIC_STYLES, INFOGRAPHIC_BASE_PROMPT, LayoutDef, StyleDef } from './infographic-data';

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

  // Strip markdown code fences
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

export interface ContentAnalysis {
  topic: string;
  dataType: string;
  complexity: string;
  tone: string;
  audience: string;
  sourceLanguage: string;
  keyPoints: string[];
}

export async function analyzeContent(userInput: string): Promise<ContentAnalysis> {
  const systemPrompt = `You are a content analyst. Analyze the given content and return a JSON object with these fields:
- topic: main topic (in the content's language)
- dataType: data type (e.g., "process", "comparison", "concept", "timeline", "stats")
- complexity: complexity level (simple/medium/complex)
- tone: content tone (e.g., "professional", "educational", "casual", "technical")
- audience: target audience
- sourceLanguage: detected language (zh/en/ja/etc)
- keyPoints: array of 3-8 key points extracted from the content

Return ONLY the JSON object, no markdown fences.`;

  const result = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInput },
  ]);

  return extractJSON<ContentAnalysis>(result);
}

// ─── Step 2: Generate Structured Content ──────────────────────────────────────

export interface StructuredSection {
  heading: string;
  keyConcept: string;
  content: string;
  visualElement: string;
  textLabels: string[];
}

export interface StructuredContent {
  title: string;
  learningObjectives: string[];
  sections: StructuredSection[];
  dataPoints: string[];
  textLabels: string[];
}

export async function generateStructuredContent(
  userInput: string,
  analysis: ContentAnalysis,
): Promise<StructuredContent> {
  const systemPrompt = `You are an infographic content structurer. Transform the given content into a structured infographic format.

Return a JSON object with these fields:
- title: infographic title (in ${analysis.sourceLanguage})
- learningObjectives: array of 2-4 learning objectives
- sections: array of 3-8 sections, each with:
  - heading: section heading
  - keyConcept: the key concept this section conveys
  - content: verbatim content from source (preserve data faithfully, no summarization)
  - visualElement: suggested visual element (e.g., "icon", "chart", "diagram", "illustration")
  - textLabels: array of short text labels for this section
- dataPoints: array of all statistics/quotes/numbers copied exactly from source
- textLabels: array of all text labels that should appear on the infographic (in ${analysis.sourceLanguage})

Rules:
- Preserve source data faithfully, no summarization or rephrasing
- Strip any credentials, API keys, tokens, or secrets
- All text in ${analysis.sourceLanguage}

Return ONLY the JSON object, no markdown fences.`;

  const result = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nContent:\n${userInput}` },
  ]);

  return extractJSON<StructuredContent>(result);
}

// ─── Step 3: Recommend Combinations ───────────────────────────────────────────

export interface LayoutStyleCombo {
  layoutId: string;
  layoutName: string;
  styleId: string;
  styleName: string;
  rationale: string;
}

export async function recommendCombinations(
  analysis: ContentAnalysis,
  structured: StructuredContent,
): Promise<LayoutStyleCombo[]> {
  const layoutOptions = INFOGRAPHIC_LAYOUTS.map(l => `${l.id}: ${l.name} - ${l.bestFor}`).join('\n');
  const styleOptions = INFOGRAPHIC_STYLES.map(s => `${s.id}: ${s.name} - ${s.description}`).join('\n');

  const systemPrompt = `You are an infographic design consultant. Based on the content analysis and structured content, recommend 3-5 layout x style combinations.

Available layouts:
${layoutOptions}

Available styles:
${styleOptions}

Return a JSON array of objects with:
- layoutId: layout id from the list above
- layoutName: layout display name
- styleId: style id from the list above
- styleName: style display name
- rationale: brief explanation of why this combination fits the content (in the content's language)

Consider: data structure to matching layout, content tone to matching style, audience expectations.

Return ONLY the JSON array, no markdown fences.`;

  const result = await callLLM([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nStructured content:\n${JSON.stringify(structured, null, 2)}` },
  ]);

  return extractJSON<LayoutStyleCombo[]>(result);
}

// ─── Step 5: Generate Final Prompt ────────────────────────────────────────────

export async function buildInfographicPrompt(
  layoutId: string,
  styleId: string,
  aspectRatio: string,
  language: string,
  structured: StructuredContent,
): Promise<string> {
  const layout = INFOGRAPHIC_LAYOUTS.find(l => l.id === layoutId);
  const style = INFOGRAPHIC_STYLES.find(s => s.id === styleId);

  if (!layout || !style) {
    throw new Error(`Unknown layout or style: ${layoutId} / ${styleId}`);
  }

  const contentSection = [
    `# ${structured.title}`,
    '',
    ...structured.sections.map((s, i) => `## ${i + 1}. ${s.heading}\n- Key Concept: ${s.keyConcept}\n- Content: ${s.content}\n- Visual: ${s.visualElement}`),
    '',
    structured.dataPoints.length > 0 ? `## Data Points\n${structured.dataPoints.map(d => `- ${d}`).join('\n')}` : '',
  ].filter(Boolean).join('\n');

  const textLabels = structured.textLabels.join(', ');

  let prompt = INFOGRAPHIC_BASE_PROMPT
    .replace('{{LAYOUT}}', layout.name)
    .replace('{{STYLE}}', style.name)
    .replace('{{ASPECT_RATIO}}', aspectRatio)
    .replace('{{LANGUAGE}}', language)
    .replace('{{LAYOUT_GUIDELINES}}', layout.guidelines)
    .replace('{{STYLE_GUIDELINES}}', style.guidelines)
    .replace('{{CONTENT}}', contentSection)
    .replace('{{TEXT_LABELS}}', textLabels);

  return prompt;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLayoutById(id: string): LayoutDef | undefined {
  return INFOGRAPHIC_LAYOUTS.find(l => l.id === id);
}

export function getStyleById(id: string): StyleDef | undefined {
  return INFOGRAPHIC_STYLES.find(s => s.id === id);
}

export { INFOGRAPHIC_LAYOUTS, INFOGRAPHIC_STYLES };
