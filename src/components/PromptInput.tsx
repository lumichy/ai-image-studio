'use client';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  return (
    <div>
      <label className="field-label">描述文本</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "输入你想要生成的图片描述，例如：一只猫坐在窗台上，夕阳的光线穿过窗户洒在它身上"}
        className="neon-input w-full h-32 px-4 py-3 rounded-xl resize-none text-sm leading-relaxed"
        maxLength={500}
      />
      <div className="text-right text-xs text-gray-600 mt-1.5 font-mono">
        {value.length}<span className="text-gray-700">/500</span>
      </div>
    </div>
  );
}
