/**
 * Model selector card component
 */
'use client';

import { Model } from '@/lib/types';
import { Zap, Scale, Target, Cpu } from 'lucide-react';

interface ModelSelectorProps {
  models: Model[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

type Tier = {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
};

function getTier(model: Model): Tier {
  const id = model.id.toLowerCase();
  if (id.includes('yolo')) {
    return { label: 'Instance', icon: Cpu, badgeClass: 'text-orange-400 bg-orange-400/10 border-orange-400/20' };
  }
  if (id.includes('b2')) {
    return { label: 'Accurate', icon: Target, badgeClass: 'text-violet-400 bg-violet-400/10 border-violet-400/20' };
  }
  if (id.includes('b1')) {
    return { label: 'Balanced', icon: Scale, badgeClass: 'text-sky-400 bg-sky-400/10 border-sky-400/20' };
  }
  return { label: 'Fast', icon: Zap, badgeClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' };
}

export function ModelSelector({
  models,
  selectedId,
  onSelect,
  disabled = false,
}: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Select Model
      </label>
      <div className="flex flex-col gap-2">
        {models.map((model) => {
          const tier = getTier(model);
          const TierIcon = tier.icon;
          const isSelected = selectedId === model.id;

          return (
            <button
              key={model.id}
              onClick={() => !disabled && onSelect(model.id)}
              disabled={disabled}
              className={[
                'group relative w-full text-left rounded-xl border px-3.5 py-3 transition-all duration-200 outline-none',
                'focus-visible:ring-2 focus-visible:ring-primary/40',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                isSelected
                  ? 'border-primary/40 bg-primary/[0.07] shadow-[0_0_0_1px_oklch(var(--primary)_/_0.15),0_4px_16px_oklch(var(--primary)_/_0.08)]'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]',
              ].join(' ')}
            >
              {/* Selection dot */}
              <span
                className={[
                  'absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-200',
                  isSelected
                    ? 'bg-primary shadow-[0_0_6px_oklch(var(--primary)_/_0.7)] scale-100 opacity-100'
                    : 'bg-white/20 scale-75 opacity-0 group-hover:opacity-40 group-hover:scale-100',
                ].join(' ')}
              />

              <div className="flex items-start gap-2.5 pr-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className={`text-sm font-semibold leading-tight ${isSelected ? 'text-white' : 'text-white/80'}`}>
                    {model.name}
                  </span>
                  <span className="text-xs text-muted-foreground leading-snug line-clamp-2">
                    {model.description}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tier.badgeClass}`}>
                  <TierIcon className="w-2.5 h-2.5" />
                  {tier.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
