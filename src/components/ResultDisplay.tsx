'use client';

import { useI18n } from '@/lib/i18n-context';

interface ResultDisplayProps {
  imageUrl: string | null;
  error: string | null;
  prompt?: string;
}

export default function ResultDisplay({ imageUrl, error, prompt }: ResultDisplayProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full flex-1">
      {error ? (
        <div className="text-center fade-in-up">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m6-.75L12 15.75m0 0L6 12m6 3.75v3.75M6.343 6.343l5.657-5.657m0 0L17.657 6.343M12 .75v3.75" />
            </svg>
          </div>
          <p className="font-medium text-red-400">{t('result.error')}</p>
          <p className="text-sm mt-2 text-gray-500 max-w-sm">{error}</p>
        </div>
      ) : imageUrl ? (
        <div className="flex flex-col items-center gap-4 w-full fade-in-up">
          {prompt && (
            <div className="w-full rounded-xl p-4 text-sm text-gray-400 max-h-32 overflow-y-auto bg-white/[0.02] border border-white/5">
              <span className="font-medium text-violet-400">{t('result.prompt')}</span>
              <span className="ml-2">{prompt}</span>
            </div>
          )}
          <div className="relative group w-full flex justify-center">
            <img
              src={imageUrl}
              alt={t('result.prompt')}
              className="max-w-full max-h-[500px] rounded-2xl border border-white/10 shadow-2xl shadow-violet-500/10"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          </div>
          <a
            href={imageUrl}
            download="generated-image.png"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn px-6 py-2.5 rounded-xl text-sm font-medium"
          >
            {t('result.download')}
          </a>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-light">{t('result.empty.title')}</p>
          <p className="text-gray-700 text-sm mt-1">{t('result.empty.subtitle')}</p>
        </div>
      )}
    </div>
  );
}
