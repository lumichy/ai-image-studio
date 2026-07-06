'use client';

import { useState } from 'react';
import ModeSwitch from '@/components/ModeSwitch';
import PromptInput from '@/components/PromptInput';
import StyleSelector from '@/components/StyleSelector';
import SizeSelector from '@/components/SizeSelector';
import ImageUpload from '@/components/ImageUpload';
import ResultDisplay from '@/components/ResultDisplay';
import GenerateButton from '@/components/GenerateButton';
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

  const handleModeChange = (newMode: GenerateMode) => {
    setMode(newMode);
    if (newMode === 'image-to-image') {
      setStyle('none');
      setSize('none');
    } else {
      if (style === 'none') setStyle('anime');
      if (size === 'none') setSize('square');
    }
  };

  const isImageMode = mode === 'image-to-image';

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const endpoint =
        mode === 'text-to-image'
          ? '/api/generate/text-to-image'
          : '/api/generate/image-to-image';

      const body =
        mode === 'text-to-image'
          ? { prompt, style, size }
          : { prompt, referenceImage, style, size };

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
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const canGenerate =
    prompt.trim().length > 0 &&
    (mode === 'text-to-image' || referenceImage.length > 0);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-2">AI 生图工作室</h1>
      <p className="text-center text-gray-400 text-sm mb-8">Powered by Agnes AI</p>

      <ModeSwitch mode={mode} onChange={handleModeChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧：参数面板 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <PromptInput value={prompt} onChange={setPrompt} />

          {mode === 'image-to-image' && (
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

        {/* 右侧：结果区 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ResultDisplay imageUrl={imageUrl} error={error} />
        </div>
      </div>
    </main>
  );
}
