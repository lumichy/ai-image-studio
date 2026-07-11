'use client';

import { useState } from 'react';
import GenerateButton from '@/components/GenerateButton';
import ResultDisplay from '@/components/ResultDisplay';
import PromptInput from '@/components/PromptInput';
import { useI18n } from '@/lib/i18n-context';
import { TranslationKey, Locale } from '@/lib/i18n';

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

const ASPECT_KEYS: { id: string; labelKey: TranslationKey }[] = [
  { id: '3:4', labelKey: 'aspect.3:4' },
  { id: '4:3', labelKey: 'aspect.4:3' },
  { id: '16:9', labelKey: 'aspect.16:9.wide' },
];

const ART_STYLES: { id: string; labelKey: TranslationKey }[] = [
  { id: '__recommend__', labelKey: 'recommend.label' },
  { id: 'ligne-claire', labelKey: 'comic.art.ligne-claire' },
  { id: 'manga', labelKey: 'comic.art.manga' },
  { id: 'realistic', labelKey: 'comic.art.realistic' },
  { id: 'ink-brush', labelKey: 'comic.art.ink-brush' },
  { id: 'chalk', labelKey: 'comic.art.chalk' },
  { id: 'minimalist', labelKey: 'comic.art.minimalist' },
];

const TONES: { id: string; labelKey: TranslationKey }[] = [
  { id: '__recommend__', labelKey: 'recommend.label' },
  { id: 'neutral', labelKey: 'comic.tone.neutral' },
  { id: 'warm', labelKey: 'comic.tone.warm' },
  { id: 'dramatic', labelKey: 'comic.tone.dramatic' },
  { id: 'romantic', labelKey: 'comic.tone.romantic' },
  { id: 'energetic', labelKey: 'comic.tone.energetic' },
  { id: 'vintage', labelKey: 'comic.tone.vintage' },
  { id: 'action', labelKey: 'comic.tone.action' },
];

const LAYOUTS: { id: string; labelKey: TranslationKey }[] = [
  { id: '__recommend__', labelKey: 'recommend.label' },
  { id: 'standard', labelKey: 'comic.layout.standard' },
  { id: 'cinematic', labelKey: 'comic.layout.cinematic' },
  { id: 'dense', labelKey: 'comic.layout.dense' },
  { id: 'splash', labelKey: 'comic.layout.splash' },
  { id: 'mixed', labelKey: 'comic.layout.mixed' },
  { id: 'webtoon', labelKey: 'comic.layout.webtoon' },
  { id: 'four-panel', labelKey: 'comic.layout.four-panel' },
];

export default function ComicFlow() {
  const { t } = useI18n();
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

  const handleGenerate = async () => {
    setError(null);

    if (needsRecommend) {
      setStep('recommending');
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(new Error('请求超时')), 400_000);
        const res = await fetch('/api/comic/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t('error.recommend'));
        if (!data.combos || !Array.isArray(data.combos)) {
          throw new Error(t('error.combo.invalid'));
        }
        setCombos(data.combos);
        setCachedAnalysis(data.analysis);
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
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('请求超时')), 500_000);
      const res = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, artId: art, toneId: tone, layoutId: layout, aspectRatio: aspect }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('error.generate'));
      if (!data.pages || !Array.isArray(data.pages)) {
        throw new Error(t('error.combo.invalid'));
      }
      setPages(data.pages);
      setTitle(data.title);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.generate'));
      setStep('input');
    }
  };

  const handleConfirmGenerate = async () => {
    const combo = combos[selectedCombo];
    setStep('generating');
    setError(null);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new Error('请求超时')), 500_000);
      const res = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, artId: combo.artId, toneId: combo.toneId, layoutId: combo.layoutId, aspectRatio: aspect, analysis: cachedAnalysis }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('error.generate'));
      if (!data.pages || !Array.isArray(data.pages)) {
        throw new Error(t('error.combo.invalid'));
      }
      setPages(data.pages);
      setTitle(data.title);
      setArt(combo.artId);
      setTone(combo.toneId);
      setLayout(combo.layoutId);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.generate'));
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
                {page.pageNumber === 1 ? t('comic.cover') : t('comic.page', { n: page.pageNumber })} — {page.title}
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
          {t('common.reset')}
        </button>
      </div>
    );
  }

  if (step === 'recommending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">{t('comic.recommending')}</p>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="spinner-ring mb-5" />
        <p className="shimmer-text text-sm font-medium">{t('comic.generating')}</p>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="space-y-4 fade-in-up">
        <div className="rounded-xl p-4 text-sm text-violet-300 bg-violet-500/5 border border-violet-500/15">
          <span className="mr-1.5">🎨</span>
          {t('comic.recommend.hint')}
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
                {combo.presetId && <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">{t('comic.preset')}: {combo.presetId}</span>}
              </div>
              <div className={`text-xs mt-1 ${selectedCombo === i ? 'opacity-70' : 'opacity-50'}`}>
                {combo.rationale}
              </div>
            </button>
          ))}
        </div>

        <div>
          <label className="field-label">{t('comic.aspect.label')}</label>
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
          onClick={handleConfirmGenerate}
          loading={false}
          disabled={false}
          label={t('generate.confirm')}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
          onClick={() => { setStep('input'); setCombos([]); }}
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  const renderSelector = (
    label: string,
    options: { id: string; labelKey: TranslationKey }[],
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
            {t(opt.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl p-4 text-sm text-cyan-300 bg-cyan-500/5 border border-cyan-500/15">
        <span className="mr-1.5">💡</span>
        {t('comic.hint')}
      </div>

      <PromptInput value={prompt} onChange={setPrompt} placeholder={t('prompt.placeholder.comic')} />

      {renderSelector(t('comic.art.label'), ART_STYLES, art, setArt)}
      {renderSelector(t('comic.tone.label'), TONES, tone, setTone)}
      {renderSelector(t('comic.layout.label'), LAYOUTS, layout, setLayout)}

      <div>
        <label className="field-label">{t('comic.aspect.label')}</label>
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
        label={needsRecommend ? t('generate.getRecommend') : t('generate.comic')}
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}
