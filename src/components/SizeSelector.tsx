'use client';

import { SIZE_OPTIONS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n-context';
import { Locale } from '@/lib/i18n';

const SIZE_LABEL_KEYS: Record<string, Record<Locale, { label: string; ratio: string }>> = {
  none: {
    zh: { label: '原状', ratio: '保持' },
    en: { label: 'Original', ratio: 'Keep' },
    ja: { label: 'オリジナル', ratio: '維持' },
  },
  square: {
    zh: { label: '1:1', ratio: '方形' },
    en: { label: '1:1', ratio: 'Square' },
    ja: { label: '1:1', ratio: '正方形' },
  },
  landscape: {
    zh: { label: '16:9', ratio: '横版' },
    en: { label: '16:9', ratio: 'Landscape' },
    ja: { label: '16:9', ratio: '横版' },
  },
  portrait: {
    zh: { label: '9:16', ratio: '竖版' },
    en: { label: '9:16', ratio: 'Portrait' },
    ja: { label: '9:16', ratio: '縦版' },
  },
  standard: {
    zh: { label: '4:3', ratio: '标准' },
    en: { label: '4:3', ratio: 'Standard' },
    ja: { label: '4:3', ratio: '標準' },
  },
};

interface SizeSelectorProps {
  selected: string;
  onChange: (id: string) => void;
  showKeepOriginal?: boolean;
}

export default function SizeSelector({ selected, onChange, showKeepOriginal }: SizeSelectorProps) {
  const { locale, t } = useI18n();
  const sizes = showKeepOriginal
    ? SIZE_OPTIONS
    : SIZE_OPTIONS.filter((s) => s.id !== 'none');

  return (
    <div>
      <label className="field-label">{t('size.label')}</label>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size, i) => {
          const labels = SIZE_LABEL_KEYS[size.id]?.[locale] ?? { label: size.label, ratio: size.ratio };
          return (
            <button
              key={size.id}
              className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 stagger-in ${
                selected === size.id ? 'option-chip-active' : 'option-chip'
              }`}
              style={{ animationDelay: `${i * 0.03}s` }}
              onClick={() => onChange(size.id)}
            >
              <div>{labels.label}</div>
              <div className={`text-[10px] mt-0.5 font-mono ${selected === size.id ? 'opacity-70' : 'opacity-40'}`}>
                {labels.ratio}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
