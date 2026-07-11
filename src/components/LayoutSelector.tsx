'use client';

import { useI18n } from '@/lib/i18n-context';
import { TranslationKey } from '@/lib/i18n';

interface LayoutDef {
  id: string;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}

const LAYOUTS: LayoutDef[] = [
  { id: '__recommend__', labelKey: 'recommend.label', descKey: 'recommend.desc' },
  { id: 'bento-grid', labelKey: 'info.layout.bento-grid', descKey: 'info.layout.bento-grid.desc' },
  { id: 'linear-progression', labelKey: 'info.layout.linear-progression', descKey: 'info.layout.linear-progression.desc' },
  { id: 'binary-comparison', labelKey: 'info.layout.binary-comparison', descKey: 'info.layout.binary-comparison.desc' },
  { id: 'comparison-matrix', labelKey: 'info.layout.comparison-matrix', descKey: 'info.layout.comparison-matrix.desc' },
  { id: 'hierarchical-layers', labelKey: 'info.layout.hierarchical-layers', descKey: 'info.layout.hierarchical-layers.desc' },
  { id: 'tree-branching', labelKey: 'info.layout.tree-branching', descKey: 'info.layout.tree-branching.desc' },
  { id: 'hub-spoke', labelKey: 'info.layout.hub-spoke', descKey: 'info.layout.hub-spoke.desc' },
  { id: 'structural-breakdown', labelKey: 'info.layout.structural-breakdown', descKey: 'info.layout.structural-breakdown.desc' },
  { id: 'iceberg', labelKey: 'info.layout.iceberg', descKey: 'info.layout.iceberg.desc' },
  { id: 'bridge', labelKey: 'info.layout.bridge', descKey: 'info.layout.bridge.desc' },
  { id: 'funnel', labelKey: 'info.layout.funnel', descKey: 'info.layout.funnel.desc' },
  { id: 'isometric-map', labelKey: 'info.layout.isometric-map', descKey: 'info.layout.isometric-map.desc' },
  { id: 'dashboard', labelKey: 'info.layout.dashboard', descKey: 'info.layout.dashboard.desc' },
  { id: 'periodic-table', labelKey: 'info.layout.periodic-table', descKey: 'info.layout.periodic-table.desc' },
  { id: 'comic-strip', labelKey: 'info.layout.comic-strip', descKey: 'info.layout.comic-strip.desc' },
  { id: 'story-mountain', labelKey: 'info.layout.story-mountain', descKey: 'info.layout.story-mountain.desc' },
  { id: 'jigsaw', labelKey: 'info.layout.jigsaw', descKey: 'info.layout.jigsaw.desc' },
  { id: 'venn-diagram', labelKey: 'info.layout.venn-diagram', descKey: 'info.layout.venn-diagram.desc' },
  { id: 'winding-roadmap', labelKey: 'info.layout.winding-roadmap', descKey: 'info.layout.winding-roadmap.desc' },
  { id: 'circular-flow', labelKey: 'info.layout.circular-flow', descKey: 'info.layout.circular-flow.desc' },
  { id: 'dense-modules', labelKey: 'info.layout.dense-modules', descKey: 'info.layout.dense-modules.desc' },
];

export default function LayoutSelector({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  const { t } = useI18n();
  return (
    <div>
      <label className="field-label">{t('infographic.layout.label')}</label>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {LAYOUTS.map((layout, i) => (
          <button
            key={layout.id}
            className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 text-center stagger-in ${
              selected === layout.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.02}s` }}
            onClick={() => onChange(layout.id)}
            title={t(layout.descKey)}
          >
            <div>{t(layout.labelKey)}</div>
            <div className={`text-[10px] mt-0.5 font-mono ${selected === layout.id ? 'opacity-70' : 'opacity-40'}`}>
              {t(layout.descKey)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
