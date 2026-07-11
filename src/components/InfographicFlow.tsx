'use client';

import { useState } from 'react';
import LayoutSelector from '@/components/LayoutSelector';
import InfoStyleSelector from '@/components/InfoStyleSelector';
import GenerateButton from '@/components/GenerateButton';
import ResultDisplay from '@/components/ResultDisplay';
import PromptInput from '@/components/PromptInput';
import { useI18n } from '@/lib/i18n-context';
import { TranslationKey } from '@/lib/i18n';

type Step = 'input' | 'recommending' | 'confirm' | 'generating' | 'done';

interface Combo {
  layoutId: string;
  layoutName: string;
  styleId: string;
  styleName: string;
  rationale: string;
}

interface CachedData {
  analysis: unknown;
  structured: unknown;
}

const ASPECT_KEYS: { id: string; labelKey: TranslationKey }[] = [
  { id: '16:9', labelKey: 'aspect.16:9' },
  { id: '9:16', labelKey: 'aspect.9:16' },
  { id: '1:1', labelKey: 'aspect.1:1' },
];

export default function InfographicFlow() {
  const { t } = useI18n();
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
          {t('common.reset')}
        </button>
      </div>
    );
  }

  if (step === 'recommending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">{t('infographic.recommending')}</p>
      </div>
    );
  }

  if (step === 'generating' && combos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">{t('infographic.generating')}</p>
      </div>
    );
  }

  if (step === 'confirm' || step === 'generating') {
    const isGenerating = step === 'generating';
    return (
      <div className="space-y-4 fade-in-up">
        <div className="rounded-xl p-4 text-sm text-violet-300 bg-violet-500/5 border border-violet-500/15">
          <span className="mr-1.5">🎨</span>
          {t('infographic.recommend.hint')}
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
          <label className="field-label">{t('infographic.aspect.label')}</label>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_KEYS.map((a) => (
              <button
                key={a.id}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 ${
                  aspect === a.id ? 'option-chip-active' : 'option-chip'
                }`}
                onClick={() => setAspect(a.id)}
                disabled={isGenerating}
              >
                {t(a.labelKey)}
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
                  analysis: cached?.analysis,
                  structured: cached?.structured,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || t('error.generate'));
              setImageUrl(data.imageUrl);
              setFullPrompt(data.fullPrompt);
              setLayout(combo.layoutId);
              setStyle(combo.styleId);
              setStep('done');
            } catch (err) {
              setError(err instanceof Error ? err.message : t('error.generate'));
              setStep('confirm');
            }
          }}
          loading={isGenerating}
          disabled={false}
          label={t('generate.confirm')}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
          onClick={() => { setStep('input'); setCombos([]); }}
          disabled={isGenerating}
        >
          {t('common.back')}
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
        if (!res.ok) throw new Error(data.error || t('error.recommend'));
        setCombos(data.combos);
        setCached({ analysis: data.analysis, structured: data.structured });
        setSelectedCombo(0);
        setStep('confirm');
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.recommend'));
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
      if (!res.ok) throw new Error(data.error || t('error.generate'));
      setImageUrl(data.imageUrl);
      setFullPrompt(data.fullPrompt);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.generate'));
      setStep('input');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 text-sm text-cyan-300 bg-cyan-500/5 border border-cyan-500/15">
        <span className="mr-1.5">💡</span>
        {t('infographic.hint')}
      </div>

      <PromptInput value={prompt} onChange={setPrompt} placeholder={t('prompt.placeholder.infographic')} />

      <LayoutSelector selected={layout} onChange={setLayout} />
      <InfoStyleSelector selected={style} onChange={setStyle} />

      <div>
        <label className="field-label">{t('infographic.aspect.label')}</label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_KEYS.map((a) => (
            <button
              key={a.id}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 ${
                aspect === a.id ? 'option-chip-active' : 'option-chip'
              }`}
              onClick={() => setAspect(a.id)}
            >
              {t(a.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <GenerateButton
        onClick={handleGenerate}
        loading={false}
        disabled={!prompt.trim()}
        label={needsRecommend ? t('generate.getRecommend') : t('generate.infographic')}
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}
