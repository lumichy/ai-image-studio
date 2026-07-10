'use client';

interface InfoStyleSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

const INFO_STYLES = [
  { id: '__recommend__', label: '请你推荐', desc: 'AI 智能匹配' },
  { id: 'craft-handmade', label: '手绘纸艺', desc: '默认' },
  { id: 'claymation', label: '黏土动画', desc: '3D黏土' },
  { id: 'kawaii', label: '日系可爱', desc: '粉彩' },
  { id: 'storybook-watercolor', label: '水彩童话', desc: '柔和' },
  { id: 'chalkboard', label: '黑板粉笔', desc: '黑板' },
  { id: 'cyberpunk-neon', label: '赛博朋克', desc: '霓虹' },
  { id: 'bold-graphic', label: '粗犷图形', desc: '漫画' },
  { id: 'aged-academia', label: '复古学术', desc: '复古' },
  { id: 'corporate-memphis', label: '企业扁平', desc: '鲜艳' },
  { id: 'technical-schematic', label: '技术蓝图', desc: '工程' },
  { id: 'origami', label: '折纸', desc: '几何' },
  { id: 'pixel-art', label: '像素艺术', desc: '8位' },
  { id: 'ui-wireframe', label: '线框图', desc: '灰度' },
  { id: 'ikea-manual', label: 'IKEA说明', desc: '极简' },
  { id: 'knolling', label: '整齐排列', desc: '俯拍' },
  { id: 'lego-brick', label: '乐高积木', desc: '玩具' },
  { id: 'pop-laboratory', label: '实验室波普', desc: '精准' },
  { id: 'morandi-journal', label: '莫兰迪手账', desc: '暖色' },
  { id: 'retro-pop-grid', label: '复古波普', desc: '70年代' },
  { id: 'hand-drawn-edu', label: '手绘教育', desc: '粉彩' },
  { id: 'retro-popup-pop', label: '复古弹出', desc: '拼贴' },
];

export default function InfoStyleSelector({ selected, onChange }: InfoStyleSelectorProps) {
  return (
    <div>
      <label className="field-label">信息图风格</label>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {INFO_STYLES.map((style, i) => (
          <button
            key={style.id}
            className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 text-center stagger-in ${
              selected === style.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.02}s` }}
            onClick={() => onChange(style.id)}
            title={style.desc}
          >
            <div>{style.label}</div>
            <div className={`text-[10px] mt-0.5 font-mono ${selected === style.id ? 'opacity-70' : 'opacity-40'}`}>
              {style.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
