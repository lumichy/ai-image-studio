'use client';

import { useState } from 'react';
import LayoutSelector from '@/components/LayoutSelector';
import InfoStyleSelector from '@/components/InfoStyleSelector';
import GenerateButton from '@/components/GenerateButton';
import ResultDisplay from '@/components/ResultDisplay';
import PromptInput from '@/components/PromptInput';

type Step = 'input' | 'generating' | 'done';

interface StructuredContent {
  title: string;
  sections: { heading: string; keyConcept: string; content: string; visualElement: string; textLabels: string[] }[];
  dataPoints: string[];
  textLabels: string[];
}

export default function InfographicFlow() {
  const [step, setStep] = useState<Step>('input');
  const [prompt, setPrompt] = useState('');
  const [layout, setLayout] = useState('__recommend__');
  const [style, setStyle] = useState('__recommend__');
  const [aspect, setAspect] = useState('16:9');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fullPrompt, setFullPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ASPECTS = [
    { id: '16:9', label: '16:9 横版' },
    { id: '9:16', label: '9:16 竖版' },
    { id: '1:1', label: '1:1 方形' },
  ];

  const handleGenerate = async () => {
    setStep('generating');
    setError(null);
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
      if (data.recommendedLayout || data.recommendedStyle) {
        if (data.recommendedLayout) setLayout(data.recommendedLayout);
        if (data.recommendedStyle) setStyle(data.recommendedStyle);
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
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

  // ─── Input / Generating ───────────────────────
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
        💡 输入主题内容，选择布局和风格，AI 会自动结构化内容并生成专业信息图
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
              disabled={step === 'generating'}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <GenerateButton
        onClick={handleGenerate}
        loading={step === 'generating'}
        disabled={!prompt.trim()}
        label="生成信息图"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
