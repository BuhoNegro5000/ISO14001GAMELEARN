'use client';

import { CheckCircle2, XCircle } from 'lucide-react';

interface FeedbackBoxProps {
  ok: boolean;
  attempt: number;
  children: React.ReactNode;
}

export default function FeedbackBox({ ok, attempt, children }: FeedbackBoxProps) {
  const tone = ok
    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
    : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';

  return (
    <div key={attempt} role="status" aria-live="polite" className={`flex gap-2.5 text-xs p-3.5 rounded-xl border leading-relaxed ${tone}`}>
      {ok ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
          {ok ? 'Correcto' : 'Por corregir'} · Evaluación {attempt}
        </span>
        <span>{children}</span>
        {!ok && (
          <span className="text-[10px] opacity-80">
            Los campos con borde rojo son los que debes cambiar. Al modificarlos podrás evaluar de nuevo.
          </span>
        )}
      </div>
    </div>
  );
}
