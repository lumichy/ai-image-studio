'use client';

import { STYLE_PRESETS } from '@/lib/constants';

interface StyleSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function StyleSelector({ selected, onChange }: StyleSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        风格
      </label>
      <div className="grid grid-cols-3 gap-2">
        {STYLE_PRESETS.map((style) => (
          <button
            key={style.id}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === style.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onChange(style.id)}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
