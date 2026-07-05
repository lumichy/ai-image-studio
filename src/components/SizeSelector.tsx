'use client';

import { SIZE_OPTIONS } from '@/lib/constants';

interface SizeSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export default function SizeSelector({ selected, onChange }: SizeSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        尺寸
      </label>
      <div className="grid grid-cols-4 gap-2">
        {SIZE_OPTIONS.map((size) => (
          <button
            key={size.id}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === size.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onChange(size.id)}
          >
            <div>{size.label}</div>
            <div className="text-xs opacity-70">{size.ratio}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
