'use client';

interface AspectRatioSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

const ASPECTS = [
  { id: 'landscape', label: '16:9', desc: '横版' },
  { id: 'portrait', label: '9:16', desc: '竖版' },
  { id: 'square', label: '1:1', desc: '方形' },
];

const ASPECT_DIMENSIONS: Record<string, string> = {
  landscape: '1024x576',
  portrait: '576x1024',
  square: '1024x1024',
};

export { ASPECT_DIMENSIONS };

export default function AspectRatioSelector({ selected, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        宽高比
      </label>
      <div className="grid grid-cols-3 gap-2">
        {ASPECTS.map((aspect) => (
          <button
            key={aspect.id}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === aspect.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onChange(aspect.id)}
          >
            <div>{aspect.label}</div>
            <div className={`text-xs ${selected === aspect.id ? 'opacity-80' : 'opacity-50'}`}>
              {aspect.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
