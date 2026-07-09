'use client';

import { GenerateMode } from '@/types';

interface ModeSwitchProps {
  mode: GenerateMode;
  onChange: (mode: GenerateMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const modes: { id: GenerateMode; label: string }[] = [
    { id: 'text-to-image', label: '文生图' },
    { id: 'image-to-image', label: '图生图' },
    { id: 'infographic', label: '信息图' },
    { id: 'comic', label: '知识漫画' },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {modes.map((m) => (
        <button
          key={m.id}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === m.id
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
