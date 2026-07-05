'use client';

import { GenerateMode } from '@/types';

interface ModeSwitchProps {
  mode: GenerateMode;
  onChange: (mode: GenerateMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          mode === 'text-to-image'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onChange('text-to-image')}
      >
        文生图
      </button>
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          mode === 'image-to-image'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => onChange('image-to-image')}
      >
        图生图
      </button>
    </div>
  );
}
