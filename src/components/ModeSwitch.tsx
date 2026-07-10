'use client';

import { GenerateMode } from '@/types';

interface ModeSwitchProps {
  mode: GenerateMode;
  onChange: (mode: GenerateMode) => void;
}

const MODE_ICONS: Record<GenerateMode, string> = {
  'text-to-image': '✦',
  'image-to-image': '⇄',
  'infographic': '▦',
  'comic': '▤',
};

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const modes: { id: GenerateMode; label: string }[] = [
    { id: 'text-to-image', label: '文生图' },
    { id: 'image-to-image', label: '图生图' },
    { id: 'infographic', label: '信息图' },
    { id: 'comic', label: '知识漫画' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-card">
      {modes.map((m) => (
        <button
          key={m.id}
          className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            mode === m.id ? 'tab-active' : 'option-chip border-transparent'
          }`}
          onClick={() => onChange(m.id)}
        >
          <span className="text-base leading-none opacity-70">{MODE_ICONS[m.id]}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  );
}
