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

  const needsRecommend = layout === '__recommend__' || style === '__recommend__';
  const isBusy = step === 'recommending' || step === 'generating';

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
        setSelectedCombo(0);
        setStep('confirm');
      } catch (err) {
        setError(err instanceof Error ? err.message : '推荐失败');
        setStep('input');
      }
      return;
    }

    await doGenerate(layout, style);
  };

  const handleConfirmGenerate = async () => {
    const combo = combos[selectedCombo];
    await doGenerate(combo.layoutId, combo.styleId);
  };

  const doGenerate = async (layoutId: string, styleId: string) => {
    setStep('generating');
    setError(null);
    try {
      const res = await fetch('/api/infographic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, layoutId, styleId, aspectRatio: aspect }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      setImageUrl(data.imageUrl);
      setFullPrompt(data.fullPrompt);
      setLayout(layoutId);
      setStyle(styleId);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep(combos.length > 0 ? 'confirm' : 'input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setLayout('__recommend__');
    setStyle('__recommend__');
    setCombos([]);
    setImageUrl(null);
    setFullPrompt('');
    setError(null);
  };

  // ─── Done ─────────────────────────────────────
  if (step === 'done') {
    return (
      <div className="space-y-4">
        <ResultDisplay imageUrl={imageUrl} error={error} prompt={fullPrompt} />
        <button
          className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          onClick={handleReset}
        >
          ↻ 重新制作
        </button>
      </div>
    );
  }

  // ─── Loading spinner ──────────────────────────
  if (isBusy && (step === 'recommending' || (step === 'generating' && combos.length === 0))) {
    const msg = step === 'recommending'
      ? 'AI 正在分析内容并推荐设计方案...'
      : 'AI 正在结构化内容并生成信息图...';
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
        <p className="text-gray-500">{msg}</p>
      </div>
    );
  }

  // ─── Confirm (recommendation results) ─────────
  if (step === 'confirm' || (step === 'generating' && combos.length > 0)) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
          🎨 AI 根据内容推荐了以下方案，选择一个后生成：
        </div>

        <div className="space-y-2">
          {combos.map((combo, i) => (
            <button
              key={i}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedCombo === i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCombo(i)}
              disabled={isBusy}
            >
              <div className="font-medium">
                {combo.layoutName} × {combo.styleName}
              </div>
              <div className={`text-sm ${selectedCombo === i ? 'opacity-80' : 'opacity-60'}`}>
                {combo.rationale}
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">宽高比</label>
          <div className="grid grid-cols-3 gap-2">
            {ASPECTS.map((a) => (
              <button
                key={a.id}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  aspect === a.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setAspect(a.id)}
                disabled={isBusy}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <GenerateButton
          onClick={handleConfirmGenerate}
          loading={step === 'generating'}
          disabled={false}
          label="确认生成"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          className="w-full text-sm text-gray-400 hover:text-gray-600"
          onClick={() => { setStep('input'); setCombos([]); }}
          disabled={isBusy}
        >
          ← 返回重新选择
        </button>
      </div>
    );
  }

  // ─── Input ────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
        💡 输入主题内容，选择布局和风格（可选「请你推荐」），AI 自动结构化内容并生成专业信息图
      </div>

      <PromptInput value={prompt} onChange={setPrompt} placeholder="输入要制作信息图的主题或内容..." />

      <LayoutSelector selected={layout} onChange={setLayout} />
      <InfoStyleSelector selected={style} onChange={setStyle} />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">宽高比</label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECTS.map((a) => (
            <button
              key={a.id}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                aspect === a.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
