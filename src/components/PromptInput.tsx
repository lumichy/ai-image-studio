'use client';

import { useI18n } from '@/lib/i18n-context';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  const { t } = useI18n();
  return (
    <div>
      <label className="field-label">{t('prompt.label')}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t('prompt.placeholder')}
        className="neon-input w-full h-32 px-4 py-3 rounded-xl resize-none text-sm leading-relaxed"
        maxLength={500}
      />
      <div className="text-right text-xs text-gray-600 mt-1.5 font-mono">
        {value.length}<span className="text-gray-700">/500</span>
      </div>
    </div>
  );
}
