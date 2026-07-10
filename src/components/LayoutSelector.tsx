'use client';

interface LayoutSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

const LAYOUTS = [
  { id: '__recommend__', label: '请你推荐', desc: 'AI 智能匹配' },
  { id: 'bento-grid', label: '便当网格', desc: '多主题概览' },
  { id: 'linear-progression', label: '线性递进', desc: '时间线/流程' },
  { id: 'binary-comparison', label: '二元对比', desc: 'A vs B' },
  { id: 'comparison-matrix', label: '对比矩阵', desc: '多因素对比' },
  { id: 'hierarchical-layers', label: '层级金字塔', desc: '优先级' },
  { id: 'tree-branching', label: '树形分支', desc: '分类/谱系' },
  { id: 'hub-spoke', label: '中心辐射', desc: '中心+关联' },
  { id: 'structural-breakdown', label: '结构拆解', desc: '剖面/拆解' },
  { id: 'iceberg', label: '冰山模型', desc: '表面vs隐藏' },
  { id: 'bridge', label: '桥梁', desc: '问题-方案' },
  { id: 'funnel', label: '漏斗', desc: '转化/过滤' },
  { id: 'isometric-map', label: '等距地图', desc: '空间关系' },
  { id: 'dashboard', label: '仪表盘', desc: '指标/KPI' },
  { id: 'periodic-table', label: '周期表', desc: '分类集合' },
  { id: 'comic-strip', label: '连环画', desc: '叙事/序列' },
  { id: 'story-mountain', label: '故事山', desc: '情节弧' },
  { id: 'jigsaw', label: '拼图', desc: '互联部分' },
  { id: 'venn-diagram', label: '韦恩图', desc: '重叠概念' },
  { id: 'winding-roadmap', label: '蜿蜒路线', desc: '旅程' },
  { id: 'circular-flow', label: '循环流程', desc: '周期循环' },
  { id: 'dense-modules', label: '高密度模块', desc: '数据丰富' },
];

export default function LayoutSelector({ selected, onChange }: LayoutSelectorProps) {
  return (
    <div>
      <label className="field-label">布局</label>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {LAYOUTS.map((layout, i) => (
          <button
            key={layout.id}
            className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 text-center stagger-in ${
              selected === layout.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.02}s` }}
            onClick={() => onChange(layout.id)}
            title={layout.desc}
          >
            <div>{layout.label}</div>
            <div className={`text-[10px] mt-0.5 font-mono ${selected === layout.id ? 'opacity-70' : 'opacity-40'}`}>
              {layout.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
