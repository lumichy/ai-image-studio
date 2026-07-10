'use client';

import { STYLE_PRESETS } from '@/lib/constants';

interface StyleSelectorProps {
  selected: string;
  onChange: (id: string) => void;
  showKeepOriginal?: boolean;
}

export default function StyleSelector({ selected, onChange, showKeepOriginal }: StyleSelectorProps) {
  const styles = showKeepOriginal
    ? STYLE_PRESETS
    : STYLE_PRESETS.filter((s) => s.id !== 'none');

  return (
    <div>
      <label className="field-label">风格</label>
      <div className="grid grid-cols-3 gap-2">
        {styles.map((style, i) => (
          <button
            key={style.id}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 stagger-in ${
              selected === style.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.03}s` }}
            onClick={() => onChange(style.id)}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
