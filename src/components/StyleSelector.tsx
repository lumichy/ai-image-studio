'use client';

import { STYLE_PRESETS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n-context';
import { Locale } from '@/lib/i18n';

const STYLE_LABEL_KEYS: Record<string, Record<Locale, string>> = {
  none: { zh: '保持原状', en: 'Keep Original', ja: 'オリジナル維持' },
  anime: { zh: '动漫', en: 'Anime', ja: 'アニメ' },
  realistic: { zh: '写实', en: 'Realistic', ja: 'リアル' },
  'oil-painting': { zh: '油画', en: 'Oil Painting', ja: '油絵' },
  cyberpunk: { zh: '赛博朋克', en: 'Cyberpunk', ja: 'サイバーパンク' },
  watercolor: { zh: '水彩', en: 'Watercolor', ja: '水彩' },
  photography: { zh: '摄影', en: 'Photography', ja: '写真' },
};

interface StyleSelectorProps {
  selected: string;
  onChange: (id: string) => void;
  showKeepOriginal?: boolean;
}

export default function StyleSelector({ selected, onChange, showKeepOriginal }: StyleSelectorProps) {
  const { locale, t } = useI18n();
  const styles = showKeepOriginal
    ? STYLE_PRESETS
    : STYLE_PRESETS.filter((s) => s.id !== 'none');

  return (
    <div>
      <label className="field-label">{t('style.label')}</label>
      <div className="grid grid-cols-3 gap-2">
        {styles.map((style, i) => {
          const label = STYLE_LABEL_KEYS[style.id]?.[locale] ?? style.label;
          return (
            <button
              key={style.id}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 stagger-in ${
                selected === style.id ? 'option-chip-active' : 'option-chip'
              }`}
              style={{ animationDelay: `${i * 0.03}s` }}
              onClick={() => onChange(style.id)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
