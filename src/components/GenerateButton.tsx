'use client';

import { useI18n } from '@/lib/i18n-context';

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  label?: string;
}

export default function GenerateButton({ onClick, loading, disabled, label }: GenerateButtonProps) {
  const { t } = useI18n();
  return (
    <button
      className="neon-btn w-full px-4 py-3.5 rounded-xl font-medium text-sm tracking-wide"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
          <span className="shimmer-text">{t('generate.loading')}</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span className="text-base">✦</span>
          {label || t('generate.label')}
        </span>
      )}
    </button>
  );
}
