'use client';

import { SIZE_OPTIONS } from '@/lib/constants';

interface SizeSelectorProps {
  selected: string;
  onChange: (id: string) => void;
  showKeepOriginal?: boolean;
}

export default function SizeSelector({ selected, onChange, showKeepOriginal }: SizeSelectorProps) {
  const sizes = showKeepOriginal
    ? SIZE_OPTIONS
    : SIZE_OPTIONS.filter((s) => s.id !== 'none');

  return (
    <div>
      <label className="field-label">尺寸</label>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size, i) => (
          <button
            key={size.id}
            className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 stagger-in ${
              selected === size.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.03}s` }}
            onClick={() => onChange(size.id)}
          >
            <div>{size.label}</div>
            <div className={`text-[10px] mt-0.5 font-mono ${selected === size.id ? 'opacity-70' : 'opacity-40'}`}>
              {size.ratio}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
