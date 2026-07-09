'use client';

import { useState } from 'react';
import LayoutSelector from '@/components/LayoutSelector';
import InfoStyleSelector from '@/components/InfoStyleSelector';
import GenerateButton from '@/components/GenerateButton';
import ResultDisplay from '@/components/ResultDisplay';
import PromptInput from '@/components/PromptInput';
// Client-side types (mirrors server types for UI)
interface ContentAnalysis {
  topic: string;
  dataType: string;
  complexity: string;
  tone: string;
  audience: string;
  sourceLanguage: string;
  keyPoints: string[];
}

interface StructuredSection {
  heading: string;
  keyConcept: string;
  content: string;
  visualElement: string;
  textLabels: string[];
}

interface StructuredContent {
  title: string;
  learningObjectives: string[];
  sections: StructuredSection[];
  dataPoints: string[];
  textLabels: string[];
}

interface LayoutStyleCombo {
  layoutId: string;
  layoutName: string;
  styleId: string;
  styleName: string;
  rationale: string;
}

type Step = 'input' | 'analyzing' | 'confirm' | 'generating' | 'done';

export default function InfographicFlow() {
  const [step, setStep] = useState<Step>('input');
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [structured, setStructured] = useState<StructuredContent | null>(null);
  const [combos, setCombos] = useState<LayoutStyleCombo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState(0);
  const [aspect, setAspect] = useState('16:9');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fullPrompt, setFullPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const ASPECTS = [
    { id: '16:9', label: '16:9 横版' },
    { id: '9:16', label: '9:16 竖版' },
    { id: '1:1', label: '1:1 方形' },
  ];

  const handleAnalyze = async () => {
    setStep('analyzing');
    setError(null);
    try {
      const res = await fetch('/api/infographic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '分析失败');
      setAnalysis(data.analysis);
      setStructured(data.structured);
      setCombos(data.combos);
      setSelectedCombo(0);
      setStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败');
      setStep('input');
    }
  };

  const handleGenerate = async () => {
    setStep('generating');
    setError(null);
    try {
      const combo = combos[selectedCombo];
      const res = await fetch('/api/infographic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structured,
          layoutId: combo.layoutId,
          styleId: combo.styleId,
          aspectRatio: aspect,
          language: analysis?.sourceLanguage || 'zh',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '生成失败');
      setImageUrl(data.imageUrl);
      setFullPrompt(data.fullPrompt);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      setStep('confirm');
    }
  };

  const handleReset = () => {
    setStep('input');
    setPrompt('');
    setAnalysis(null);
    setStructured(null);
    setCombos([]);
    setImageUrl(null);
    setFullPrompt('');
    setError(null);
  };

  // ─── Step: Input ─────────────────────────────────────────────
  if (step === 'input') {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
          💡 信息图模式：输入主题/内容 → AI 分析并推荐布局×风格组合 → 确认后生成专业信息图
        </div>
        <PromptInput value={prompt} onChange={setPrompt} placeholder="输入要制作信息图的主题或内容..." />
        <GenerateButton
          onClick={handleAnalyze}
          loading={false}
          disabled={!prompt.trim()}
          label="开始分析"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    );
  }

  // ─── Step: Analyzing ─────────────────────────────────────────
  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
        <p className="text-gray-500">AI 正在分析内容并推荐设计方案...</p>
      </div>
    );
  }

  // ─── Step: Confirm ───────────────────────────────────────────
  if (step === 'confirm' || step === 'generating') {
    return (
      <div className="space-y-4">
        {/* Analysis summary */}
        {analysis && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="font-medium text-gray-700 mb-1">📊 内容分析</div>
            <div className="text-gray-600">
              主题: {analysis.topic} · 类型: {analysis.dataType} · 复杂度: {analysis.complexity} · 受众: {analysis.audience}
            </div>
            {analysis.keyPoints.length > 0 && (
              <div className="mt-1 text-gray-500">
                关键点: {analysis.keyPoints.join(' · ')}
              </div>
            )}
          </div>
        )}

        {/* Structured content preview */}
        {structured && (
          <details className="bg-gray-50 rounded-lg p-3 text-sm">
            <summary className="font-medium text-gray-700 cursor-pointer">
              📝 结构化内容（{structured.sections.length} 个板块）
            </summary>
            <div className="mt-2 space-y-2">
              <div className="font-medium">{structured.title}</div>
              {structured.sections.map((s, i) => (
                <div key={i} className="text-gray-600">
                  <span className="font-medium">{i + 1}. {s.heading}</span>
                  <span className="text-gray-400 ml-2">[{s.visualElement}]</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Combination selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎨 推荐设计方案（选择一个）
          </label>
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
                disabled={step === 'generating'}
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
        </div>

        {/* Aspect ratio */}
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
          disabled={false}
          label="生成信息图"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    );
  }

  // ─── Step: Done ──────────────────────────────────────────────
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

  return null;
}
