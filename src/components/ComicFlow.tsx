'use client';

import { useState } from 'react';
import GenerateButton from '@/components/GenerateButton';
import ResultDisplay from '@/components/ResultDisplay';
import PromptInput from '@/components/PromptInput';

type Step = 'input' | 'recommending' | 'confirm' | 'generating' | 'done';

interface Combo {
  presetId?: string | null;
  artId: string;
  artName: string;
  toneId: string;
  toneName: string;
  layoutId: string;
  layoutName: string;
  rationale: string;
}

interface ComicPage {
  pageNumber: number;
  type: string;
  title: string;
  imageUrl: string;
  fullPrompt: string;
}

const ASPECTS = [
  { id: '3:4', label: '3:4 竖版' },
  { id: '4:3', label: '4:3 横版' },
  { id: '16:9', label: '16:9 宽屏' },
];

export default function ComicFlow() {
  const [step, setStep] = useState<Step>('input');
  const [prompt, setPrompt] = useState('');
  const [art, setArt] = useState('__recommend__');
  const [tone, setTone] = useState('__recommend__');
  const [layout, setLayout] = useState('__recommend__');
  const [aspect, setAspect] = useState('3:4');
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState(0);
  const [pages, setPages] = useState<ComicPage[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cachedAnalysis, setCachedAnalysis] = useState<unknown>(null);

  const needsRecommend = art === '__recommend__' || tone === '__recommend__' || layout === '__recommend__';

  const ART_STYLES = [
    { id: '__recommend__', label: '请你推荐' },
    { id: 'ligne-claire', label: '清线' },
    { id: 'manga', label: '漫画' },
    { id: 'realistic', label: '写实' },
    { id: 'ink-brush', label: '水墨' },
    { id: 'chalk', label: '粉笔' },
    { id: 'minimalist', label: '极简' },
  ];

  const TONES = [
    { id: '__recommend__', label: '请你推荐' },
    { id: 'neutral', label: '中性' },
    { id: 'warm', label: '温暖' },
    { id: 'dramatic', label: '戏剧' },
    { id: 'romantic', label: '浪漫' },
    { id: 'energetic', label: '活力' },
    { id: 'vintage', label: '复古' },
    { id: 'action', label: '动作' },
  ];

  const LAYOUTS = [
    { id: '__recommend__', label: '请你推荐' },
    { id: 'standard', label: '标准' },
    { id: 'cinematic', label: '电影' },
    { id: 'dense', label: '密集' },
    { id: 'splash', label: '大画面' },
    { id: 'mixed', label: '混合' },
    { id: 'webtoon', label: '条漫' },
    { id: 'four-panel', label: '四格' },
  ];

  const handleGenerate = async () => {
    setError(null);

    if (needsRecommend) {
      setStep('recommending');
      try {
        const res = await fetch('/api/comic/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '推荐失败');
        if (!data.combos || !Array.isArray(data.combos)) {
          throw new Error('推荐返回数据异常');
        }
        setCombos(data.combos);
        setCachedAnalysis(data.analysis);
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
      const res = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, artId: art, toneId: tone, layoutId: layout, aspectRatio: aspect }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      if (!data.pages || !Array.isArray(data.pages)) {
        throw new Error('生成返回数据异常');
      }
      setPages(data.pages);
      setTitle(data.title);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep('input');
    }
  };

  const handleConfirmGenerate = async () => {
    const combo = combos[selectedCombo];
    setStep('generating');
    setError(null);
    try {
      const res = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, artId: combo.artId, toneId: combo.toneId, layoutId: combo.layoutId, aspectRatio: aspect, analysis: cachedAnalysis }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      if (!data.pages || !Array.isArray(data.pages)) {
        throw new Error('生成返回数据异常');
      }
      setPages(data.pages);
      setTitle(data.title);
      setArt(combo.artId);
      setTone(combo.toneId);
      setLayout(combo.layoutId);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep('confirm');
    }
  };

  const handleReset = () => {
    setStep('input');
    setArt('__recommend__');
    setTone('__recommend__');
    setLayout('__recommend__');
    setCombos([]);
    setPages([]);
    setTitle('');
    setError(null);
    setCachedAnalysis(null);
  };

  if (step === 'done') {
    return (
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-violet-300">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pages.map((page, i) => (
            <div key={page.pageNumber} className="space-y-2 fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-sm font-medium text-gray-400">
                {page.pageNumber === 1 ? '封面' : `第 ${page.pageNumber} 页`} — {page.title}
              </div>
              <img
                src={page.imageUrl}
                alt={page.title}
                className="w-full rounded-xl border border-white/10 shadow-lg shadow-violet-500/5"
              />
            </div>
          ))}
        </div>
        <button
          className="option-chip w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          onClick={handleReset}
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
        <p className="shimmer-text text-sm font-medium">AI 正在分析内容并推荐漫画风格</p>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">AI 正在编写剧本并生成漫画页面</p>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="space-y-4 fade-in-up">
        <div className="rounded-xl p-4 text-sm text-violet-300 bg-violet-500/5 border border-violet-500/15">
          <span className="mr-1.5">🎨</span>
          AI 根据内容推荐了以下漫画风格方案，选择一个后生成：
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
            >
              <div className="font-medium text-sm">
                {combo.artName} <span className="text-gray-500 mx-1">×</span> {combo.toneName} <span className="text-gray-500 mx-1">×</span> {combo.layoutName}
                {combo.presetId && <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">预设: {combo.presetId}</span>}
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
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <GenerateButton
          onClick={handleConfirmGenerate}
          loading={false}
          disabled={false}
          label="确认生成"
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
          onClick={() => { setStep('input'); setCombos([]); }}
        >
          ← 返回重新选择
        </button>
      </div>
    );
  }

  const renderSelector = (
    label: string,
    options: { id: string; label: string }[],
    value: string,
    setter: (v: string) => void,
  ) => (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <button
            key={opt.id}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-250 stagger-in ${
              value === opt.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.02}s` }}
            onClick={() => setter(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 text-sm text-cyan-300 bg-cyan-500/5 border border-cyan-500/15">
        <span className="mr-1.5">💡</span>
        输入主题内容，选择画风/色调/排版（可选「请你推荐」），AI 自动编写剧本并生成多页漫画
      </div>

      <PromptInput value={prompt} onChange={setPrompt} placeholder="输入要制作漫画的主题或内容，例如：图灵的故事、量子力学入门..." />

      {renderSelector('画风', ART_STYLES, art, setArt)}
      {renderSelector('色调', TONES, tone, setTone)}
      {renderSelector('排版', LAYOUTS, layout, setLayout)}

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
        label={needsRecommend ? '获取推荐方案' : '生成漫画'}
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}
