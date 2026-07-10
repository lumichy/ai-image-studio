'use client';

import { useState } from 'react';
import LayoutSelector from '@/components/LayoutSelector';
import InfoStyleSelector from '@/components/InfoStyleSelector';
import GenerateButton from '@/components/GenerateButton';
import ResultDisplay from '@/components/ResultDisplay';
import PromptInput from '@/components/PromptInput';

type Step = 'input' | 'recommending' | 'confirm' | 'generating' | 'done';

interface Combo {
  layoutId: string;
  layoutName: string;
  styleId: string;
  styleName: string;
  rationale: string;
}

// Cached analysis & structured content from recommend step
// to skip redundant LLM calls in generate step
interface CachedData {
  analysis: unknown;
  structured: unknown;
}

const ASPECTS = [
  { id: '16:9', label: '16:9 横版' },
  { id: '9:16', label: '9:16 竖版' },
  { id: '1:1', label: '1:1 方形' },
];

export default function InfographicFlow() {
  const [step, setStep] = useState<Step>('input');
  const [prompt, setPrompt] = useState('');
  const [layout, setLayout] = useState('__recommend__');
  const [style, setStyle] = useState('__recommend__');
  const [aspect, setAspect] = useState('16:9');
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fullPrompt, setFullPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState<CachedData | null>(null);

  const needsRecommend = layout === '__recommend__' || style === '__recommend__';

  if (step === 'done') {
    return (
      <div className="space-y-4">
        <ResultDisplay imageUrl={imageUrl} error={error} prompt={fullPrompt} />
        <button
          className="option-chip w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          onClick={() => {
            setStep('input');
            setLayout('__recommend__');
            setStyle('__recommend__');
            setCombos([]);
            setImageUrl(null);
            setFullPrompt('');
            setError(null);
            setCached(null);
          }}
        >
          ↻ 重新制作
        </button>
      </div>
    );
  }

  if (step === 'recommending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">AI 正在分析内容并推荐设计方案</p>
      </div>
    );
  }

  if (step === 'generating' && combos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">AI 正在结构化内容并生成信息图</p>
      </div>
    );
  }

  if (step === 'confirm' || step === 'generating') {
    const isGenerating = step === 'generating';
    return (
      <div className="space-y-4 fade-in-up">
        <div className="rounded-xl p-4 text-sm text-violet-300 bg-violet-500/5 border border-violet-500/15">
          <span className="mr-1.5">🎨</span>
          AI 根据内容推荐了以下方案，选择一个后生成：
        </div>

        <div className="space-y-2">
          {combos.map((combo, i) => (
            <button
              key={i}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-250 stagger-in ${
                selectedCombo === i ? 'option-chip-active' : 'option-chip'
              }`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setSelectedCombo(i)}
              disabled={isGenerating}
            >
              <div className="font-medium text-sm">
                {combo.layoutName} <span className="text-gray-500 mx-1">×</span> {combo.styleName}
              </div>
              <div className={`text-xs mt-1 ${selectedCombo === i ? 'opacity-70' : 'opacity-50'}`}>
                {combo.rationale}
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="field-label">宽高比</label>
          <div className="grid grid-cols-3 gap-2">
            {ASPECTS.map((a) => (
              <button
                key={a.id}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 ${
                  aspect === a.id ? 'option-chip-active' : 'option-chip'
                }`}
                onClick={() => setAspect(a.id)}
                disabled={isGenerating}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <GenerateButton
          onClick={async () => {
            setStep('generating');
            setError(null);
            try {
              const combo = combos[selectedCombo];
              const res = await fetch('/api/infographic/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt,
                  layoutId: combo.layoutId,
                  styleId: combo.styleId,
                  aspectRatio: aspect,
                  // Pass cached analysis & structured to skip 2 redundant LLM calls
                  analysis: cached?.analysis,
                  structured: cached?.structured,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || '生成失败');
              setImageUrl(data.imageUrl);
              setFullPrompt(data.fullPrompt);
              setLayout(combo.layoutId);
              setStyle(combo.styleId);
              setStep('done');
            } catch (err) {
              setError(err instanceof Error ? err.message : '生成失败');
              setStep('confirm');
            }
          }}
          loading={isGenerating}
          disabled={false}
          label="确认生成"
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
          onClick={() => { setStep('input'); setCombos([]); }}
          disabled={isGenerating}
        >
          ← 返回重新选择
        </button>
      </div>
    );
  }

  const handleGenerate = async () => {
    setError(null);

    if (needsRecommend) {
      setStep('recommending');
      try {
        const res = await fetch('/api/infographic/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '推荐失败');
        setCombos(data.combos);
        // Cache analysis & structured for later generate call
        setCached({ analysis: data.analysis, structured: data.structured });
        setSelectedCombo(0);
        setStep('confirm');
      } catch (err) {
        setError(err instanceof Error ? err.message : '推荐失败');
        setStep('input');
      }
      return;
    }

    setStep('generating');
    setCombos([]);
    try {
      const res = await fetch('/api/infographic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, layoutId: layout, styleId: style, aspectRatio: aspect }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      setImageUrl(data.imageUrl);
      setFullPrompt(data.fullPrompt);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep('input');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 text-sm text-cyan-300 bg-cyan-500/5 border border-cyan-500/15">
        <span className="mr-1.5">💡</span>
        输入主题内容，选择布局和风格（可选「请你推荐」），AI 自动结构化内容并生成专业信息图
      </div>

      <PromptInput value={prompt} onChange={setPrompt} placeholder="输入要制作信息图的主题或内容..." />

      <LayoutSelector selected={layout} onChange={setLayout} />
      <InfoStyleSelector selected={style} onChange={setStyle} />

      <div>
        <label className="field-label">宽高比</label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECTS.map((a) => (
            <button
              key={a.id}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 ${
                aspect === a.id ? 'option-chip-active' : 'option-chip'
              }`}
              onClick={() => setAspect(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <GenerateButton
        onClick={handleGenerate}
        loading={false}
        disabled={!prompt.trim()}
        label={needsRecommend ? '获取推荐方案' : '生成信息图'}
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}
