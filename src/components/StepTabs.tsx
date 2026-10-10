'use client';

import { Check, Lock } from 'lucide-react';

export interface StepTabItem {
  label: string;
  unlocked: boolean;
  done?: boolean;
}

interface StepTabsProps {
  steps: StepTabItem[];
  current: number;
  onSelect: (step: number) => void;
}

export default function StepTabs({ steps, current, onSelect }: StepTabsProps) {
  return (
    <div role="tablist" aria-label="Pasos de la cláusula" className="flex flex-wrap gap-1.5 text-[10px] font-bold">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCurrent = current === stepNumber;
        const stateClass = isCurrent
          ? 'bg-emerald-600 text-white'
          : step.unlocked
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900 cursor-pointer'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed';

        return (
          <button
            key={step.label}
            type="button"
            role="tab"
            aria-selected={isCurrent}
            disabled={!step.unlocked}
            title={step.unlocked ? undefined : 'Completa el paso anterior para desbloquearlo'}
            onClick={() => onSelect(stepNumber)}
            className={`flex items-center gap-1 rounded px-2 py-1 transition-colors ${stateClass}`}
          >
            {step.done && !isCurrent ? <Check className="h-3 w-3" /> : null}
            {!step.unlocked ? <Lock className="h-3 w-3" /> : null}
            {step.label}
          </button>
        );
      })}
    </div>
  );
}
