'use client';

import { useState } from 'react';
import ModeSwitch from '@/components/ModeSwitch';
import PromptInput from '@/components/PromptInput';
import StyleSelector from '@/components/StyleSelector';
import SizeSelector from '@/components/SizeSelector';
import ImageUpload from '@/components/ImageUpload';
import ResultDisplay from '@/components/ResultDisplay';
import GenerateButton from '@/components/GenerateButton';
import InfographicFlow from '@/components/InfographicFlow';
import ComicFlow from '@/components/ComicFlow';
import { GenerateMode } from '@/types';

export default function Home() {
  const [mode, setMode] = useState<GenerateMode>('text-to-image');

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('anime');
  const [size, setSize] = useState('square');
  const [referenceImage, setReferenceImage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState('');

  const handleModeChange = (newMode: GenerateMode) => {
    setMode(newMode);
    if (newMode === 'image-to-image') {
      setStyle('none');
      setSize('none');
    } else if (newMode === 'text-to-image') {
      if (style === 'none') setStyle('anime');
      if (size === 'none') setSize('square');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      let endpoint: string;
      let body: Record<string, unknown>;

      if (mode === 'text-to-image') {
        endpoint = '/api/generate/text-to-image';
        body = { prompt, style, size };
      } else if (mode === 'image-to-image') {
        endpoint = '/api/generate/image-to-image';
        body = { prompt, referenceImage, style, size };
      } else {
        return;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '生成失败');
      }

      setImageUrl(data.imageUrl);
      setDisplayPrompt(data.fullPrompt || prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const canGenerate =
    prompt.trim().length > 0 &&
    (mode === 'text-to-image' ||
      (mode === 'image-to-image' && referenceImage.length > 0));

  const isImageMode = mode === 'image-to-image';
  const isInfographicMode = mode === 'infographic';
  const isComicMode = mode === 'comic';

  return (
    <main className="relative z-10 min-h-screen px-4 py-10 md:py-16">
      {/* ─── Header ─────────────────────────────── */}
      <header className="max-w-6xl mx-auto mb-10 text-center fade-in-up">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 glow-pulse" />
          <span className="text-xs font-mono tracking-widest text-gray-500 uppercase">Agnes AI · Live</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            AI 生图工作室
          </span>
        </h1>
        <p className="mt-3 text-sm text-gray-500 font-light tracking-wide">
          文生图 · 图生图 · 信息图 · 知识漫画
        </p>
      </header>

      {/* ─── Mode Switch ────────────────────────── */}
      <div className="max-w-6xl mx-auto mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ModeSwitch mode={mode} onChange={handleModeChange} />
      </div>

      {/* ─── Content ───────────────────────────── */}
      <div className="max-w-6xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
        {isInfographicMode ? (
          <div className="glass-card p-6 md:p-8">
            <InfographicFlow />
          </div>
        ) : isComicMode ? (
          <div className="glass-card p-6 md:p-8">
            <ComicFlow />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
          <div className="glass-card p-6 md:p-8">
            <div className="space-y-5">
              <PromptInput value={prompt} onChange={setPrompt} />

              {isImageMode && (
                <ImageUpload onUpload={setReferenceImage} />
              )}

              <StyleSelector selected={style} onChange={setStyle} showKeepOriginal={isImageMode} />
              <SizeSelector selected={size} onChange={setSize} showKeepOriginal={isImageMode} />

              <GenerateButton
                onClick={handleGenerate}
                loading={loading}
                disabled={!canGenerate}
              />
            </div>
          </div>

          {/* Result Panel */}
          <div className="glass-card p-6 md:p-8 flex flex-col">
            <ResultDisplay imageUrl={imageUrl} error={error} prompt={displayPrompt} />
          </div>
        </div>
        )}
      </div>

      {/* ─── Footer ────────────────────────────── */}
      <footer className="max-w-6xl mx-auto mt-16 text-center">
        <p className="text-xs text-gray-600 font-mono">
          Powered by Agnes AI · Built with Next.js
        </p>
      </footer>
    </main>
  );
}
