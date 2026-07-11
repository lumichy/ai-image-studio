import { INFOGRAPHIC_LAYOUTS, INFOGRAPHIC_STYLES, INFOGRAPHIC_BASE_PROMPT, LayoutDef, StyleDef } from './infographic-data';

const LLM_API_URL = process.env.AGNES_API_BASE_URL ?? 'https://apihub.agnes-ai.com/v1';
const LLM_API_KEY = process.env.AGNES_API_KEY ?? '';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Non-streaming completion — used as a fallback when the streaming response
// comes back empty (occasional upstream flakiness). Returns the answer text.
async function nonStreamingComplete(
  messages: ChatMessage[],
  maxTokens: number,
  timeoutMs: number,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('LLM 请求超时')), timeoutMs);

  try {
    const response = await fetch(`${LLM_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'agnes-2.0-flash',
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
        stream: false,
        chat_template_kwargs: { enable_thinking: false },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM API error: ${response.status} ${error}`);
    }

    const json = await response.json();
    const msg = json.choices?.[0]?.message;
    const content = (msg?.content || msg?.reasoning_content || '') as string;
    // Diagnostic: if upstream returned an empty body, log the raw payload so
    // we can see whether the answer landed in an unexpected field.
    if (!content || !content.trim()) {
      console.log('[nonStreamingComplete] EMPTY response:', JSON.stringify(json).slice(0, 1000));
    }
    return content;
  } finally {
    clearTimeout(timer);
  }
}

async function callLLM(messages: ChatMessage[], options?: { maxTokens?: number; timeoutMs?: number; retries?: number }): Promise<string> {
  const maxTokens = options?.maxTokens ?? 8192;
  const timeoutMs = options?.timeoutMs ?? 120_000;
  const maxRetries = options?.retries ?? 3;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    let abortedByTimer = false;
    const timer = setTimeout(() => {
      abortedByTimer = true;
      controller.abort(new Error('LLM 请求超时'));
    }, timeoutMs);

    try {
      const response = await fetch(`${LLM_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LLM_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'agnes-2.0-flash',
          messages,
          temperature: 0.3,
          max_tokens: maxTokens,
          stream: true,
          // Disable the reasoning model's chain-of-thought: it otherwise dumps
          // everything into reasoning_content (leaving content empty) and burns
          // the whole token budget thinking, which makes the stream exceed the
          // timeout. With thinking off, the answer goes straight to content.
          chat_template_kwargs: { enable_thinking: false },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        clearTimeout(timer);
        throw new Error(`LLM API error: ${response.status} ${error}`);
      }

      if (!response.body) {
        clearTimeout(timer);
        throw new Error('LLM API returned no body');
      }

      // Stream response — accumulate content deltas
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              // Reasoning models may place the answer in reasoning_content; fall back to it.
              // Some providers also use `text`.
              if (delta?.content) fullContent += delta.content;
              else if (delta?.reasoning_content) fullContent += delta.reasoning_content;
              else if ((delta as { text?: string })?.text) fullContent += (delta as { text?: string }).text!;
            } catch {
              // Ignore malformed lines
            }
          }
        }
      }
      clearTimeout(timer);

      if (!fullContent || fullContent.trim().length === 0) {
        // Streaming returned nothing. The model intermittently streams an empty
        // body on long prompts; a non-streaming call is far more reliable, so
        // retry it a few times (and tolerate transient NS errors) before giving up.
        let ns = '';
        for (let nsAttempt = 1; nsAttempt <= 3; nsAttempt++) {
          try {
            ns = await nonStreamingComplete(messages, maxTokens, timeoutMs);
          } catch (e) {
            console.log(`NS fallback attempt ${nsAttempt} threw: ${e instanceof Error ? e.message : String(e)}`);
            ns = '';
          }
          if (ns && ns.trim()) return ns;
          if (nsAttempt < 3) await new Promise((r) => setTimeout(r, 1500));
        }
        throw new Error('LLM returned empty content (reasoning consumed all tokens)');
      }

      return fullContent;
    } catch (err) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));
      // Use controller.signal.aborted / abortedByTimer as the reliable signal:
      // when we abort with a custom reason, undici may NOT throw an error whose
      // name is 'AbortError', so relying on lastError.name would silently skip
      // retries. The flag guarantees timeouts always retry.
      const isAbort =
        lastError.name === 'AbortError' ||
        controller.signal.aborted ||
        abortedByTimer;
      const isTimeout =
        abortedByTimer ||
        controller.signal.aborted ||
        lastError.name === 'AbortError' ||
        lastError.message.toLowerCase().includes('timeout') ||
        lastError.message.includes('超时');
      const isEmpty = lastError.message.includes('empty content');

      if (attempt < maxRetries && (isAbort || isTimeout || isEmpty)) {
        console.log(`LLM attempt ${attempt}/${maxRetries} failed: ${lastError.message}. Retrying...`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
        continue;
      }
      // Surface a friendly, actionable message instead of the raw Undici
      // "signal is aborted without reason" error.
      if (isAbort || isTimeout) {
        throw new Error(`LLM 请求超时，已重试 ${maxRetries} 次仍失败，请稍后重试`);
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error('LLM call failed after all retries');
}

// ─── Call LLM and parse JSON with retries ────────────────────────────────────

async function callAndParse<T>(
  messages: ChatMessage[],
  parse: (raw: string) => T,
  opts?: { maxTokens?: number; timeoutMs?: number; retries?: number },
): Promise<T> {
  const maxRetries = opts?.retries ?? 3;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const raw = await callLLM(messages, opts);
    try {
      return parse(raw);
    } catch (err) {
      lastError = err;
      console.log(`JSON parse attempt ${attempt}/${maxRetries} failed: ${err instanceof Error ? err.message : String(err)}. Retrying...`);
      if (attempt < maxRetries) await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastError ?? new Error('JSON parse failed after all retries');
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

  return callAndParse<ContentAnalysis>(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
    extractJSON<ContentAnalysis>,
    { maxTokens: 4096, timeoutMs: 120_000, retries: 3 },
  );
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

  return callAndParse<StructuredContent>(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nContent:\n${userInput}` },
    ],
    extractJSON<StructuredContent>,
    { maxTokens: 4096, timeoutMs: 120_000, retries: 3 },
  );
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

  return callAndParse<LayoutStyleCombo[]>(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Analysis:\n${JSON.stringify(analysis, null, 2)}\n\nStructured content:\n${JSON.stringify(structured, null, 2)}` },
    ],
    extractJSON<LayoutStyleCombo[]>,
    { maxTokens: 4096, timeoutMs: 120_000, retries: 3 },
  );
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
