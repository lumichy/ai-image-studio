'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n-context';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="field-label">{t('upload.label')}</label>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt={t('upload.preview')}
            className="w-full max-h-48 object-contain rounded-xl border border-white/10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <button
              className="px-3 py-1.5 bg-red-500/80 text-white rounded-lg text-xs font-medium backdrop-blur hover:bg-red-500 transition-colors"
              onClick={() => {
                setPreview(null);
                onUpload('');
              }}
            >
              {t('upload.remove')}
            </button>
          </div>
        </div>
      ) : (
        <label className="upload-zone flex flex-col items-center justify-center w-full h-32 rounded-xl cursor-pointer gap-2">
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span className="text-sm text-gray-500">{t('upload.click')}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
