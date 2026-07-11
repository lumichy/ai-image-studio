'use client';

import { useI18n } from '@/lib/i18n-context';
import { TranslationKey } from '@/lib/i18n';

interface StyleDef {
  id: string;
  labelKey: TranslationKey;
  descKey: TranslationKey;
}

const STYLES: StyleDef[] = [
  { id: '__recommend__', labelKey: 'recommend.label', descKey: 'recommend.desc' },
  { id: 'craft-handmade', labelKey: 'info.style.craft-handmade', descKey: 'info.style.craft-handmade.desc' },
  { id: 'claymation', labelKey: 'info.style.claymation', descKey: 'info.style.claymation.desc' },
  { id: 'kawaii', labelKey: 'info.style.kawaii', descKey: 'info.style.kawaii.desc' },
  { id: 'storybook-watercolor', labelKey: 'info.style.storybook-watercolor', descKey: 'info.style.storybook-watercolor.desc' },
  { id: 'chalkboard', labelKey: 'info.style.chalkboard', descKey: 'info.style.chalkboard.desc' },
  { id: 'cyberpunk-neon', labelKey: 'info.style.cyberpunk-neon', descKey: 'info.style.cyberpunk-neon.desc' },
  { id: 'bold-graphic', labelKey: 'info.style.bold-graphic', descKey: 'info.style.bold-graphic.desc' },
  { id: 'aged-academia', labelKey: 'info.style.aged-academia', descKey: 'info.style.aged-academia.desc' },
  { id: 'corporate-memphis', labelKey: 'info.style.corporate-memphis', descKey: 'info.style.corporate-memphis.desc' },
  { id: 'technical-schematic', labelKey: 'info.style.technical-schematic', descKey: 'info.style.technical-schematic.desc' },
  { id: 'origami', labelKey: 'info.style.origami', descKey: 'info.style.origami.desc' },
  { id: 'pixel-art', labelKey: 'info.style.pixel-art', descKey: 'info.style.pixel-art.desc' },
  { id: 'ui-wireframe', labelKey: 'info.style.ui-wireframe', descKey: 'info.style.ui-wireframe.desc' },
  { id: 'ikea-manual', labelKey: 'info.style.ikea-manual', descKey: 'info.style.ikea-manual.desc' },
  { id: 'knolling', labelKey: 'info.style.knolling', descKey: 'info.style.knolling.desc' },
  { id: 'lego-brick', labelKey: 'info.style.lego-brick', descKey: 'info.style.lego-brick.desc' },
  { id: 'pop-laboratory', labelKey: 'info.style.pop-laboratory', descKey: 'info.style.pop-laboratory.desc' },
  { id: 'morandi-journal', labelKey: 'info.style.morandi-journal', descKey: 'info.style.morandi-journal.desc' },
  { id: 'retro-pop-grid', labelKey: 'info.style.retro-pop-grid', descKey: 'info.style.retro-pop-grid.desc' },
  { id: 'hand-drawn-edu', labelKey: 'info.style.hand-drawn-edu', descKey: 'info.style.hand-drawn-edu.desc' },
  { id: 'retro-popup-pop', labelKey: 'info.style.retro-popup-pop', descKey: 'info.style.retro-popup-pop.desc' },
];

export default function InfoStyleSelector({ selected, onChange }: { selected: string; onChange: (id: string) => void }) {
  const { t } = useI18n();
  return (
    <div>
      <label className="field-label">{t('infographic.style.label')}</label>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {STYLES.map((style, i) => (
          <button
            key={style.id}
            className={`px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-250 text-center stagger-in ${
              selected === style.id ? 'option-chip-active' : 'option-chip'
            }`}
            style={{ animationDelay: `${i * 0.02}s` }}
            onClick={() => onChange(style.id)}
            title={t(style.descKey)}
          >
            <div>{t(style.labelKey)}</div>
            <div className={`text-[10px] mt-0.5 font-mono ${selected === style.id ? 'opacity-70' : 'opacity-40'}`}>
              {t(style.descKey)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
