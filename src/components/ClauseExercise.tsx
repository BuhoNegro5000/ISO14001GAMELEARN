'use client';

import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import type { Exercise } from '@/lib/clauseExercises';

export default function ClauseExercise({ exercise }: { exercise: Exercise }) {
  const awardXp = useGameStore((s) => s.awardXp);
  const triggerEvent = useGameStore((s) => s.triggerEvent);
  const completed = useGameStore((s) =>
    s.claimedRewards.includes(`${s.currentCompanyId}:ex:${exercise.id}`)
  );

  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [checked, setChecked] = useState(false);

  const isWrong = (itemId: string): boolean => {
    if (exercise.kind === 'classify') {
      const item = exercise.items.find((i) => i.id === itemId);
      return !item || answers[itemId] !== item.answer;
    }
    const item = exercise.items.find((i) => i.id === itemId);
    return !item || Boolean(answers[itemId]) !== item.correct;
  };

  const wrongIds = exercise.items.filter((i) => isWrong(i.id)).map((i) => i.id);
  const total = exercise.items.length;
  const unanswered =
    exercise.kind === 'classify' && exercise.items.some((i) => !answers[i.id]);

  const verify = () => {
    if (unanswered) {
      setChecked(false);
      return;
    }
    setChecked(true);
    if (wrongIds.length === 0 && awardXp(`ex:${exercise.id}`, exercise.xp)) {
      triggerEvent({
        type: 'success',
        message: `${exercise.successMessage} (+${exercise.xp} XP)`
      });
    }
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
  };

  const showHints = checked || completed;

  return (
    <section
      aria-labelledby={`ex-${exercise.id}-title`}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Práctica normativa {exercise.ref}
          </span>
          <h5
            id={`ex-${exercise.id}-title`}
            className="text-xs font-extrabold leading-snug text-slate-800 dark:text-slate-100"
          >
            {exercise.title}
          </h5>
        </div>
        {completed && (
          <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Completado
          </span>
        )}
      </header>

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{exercise.intro}</p>

      <ul className="flex flex-col gap-2">
        {exercise.items.map((item) => {
          const wrong = showHints && !completed && isWrong(item.id);
          const border = wrong
            ? 'border-rose-500/50 bg-rose-500/5'
            : completed
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900';

          return (
            <li
              key={item.id}
              className={`flex flex-col gap-2 rounded-xl border p-3 text-xs ${border}`}
            >
              {exercise.kind === 'classify' ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold leading-snug text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                  <select
                    aria-label={`Clasificación para: ${item.text}`}
                    value={(answers[item.id] as string) ?? ''}
                    disabled={completed}
                    onChange={(e) => {
                      setAnswers({ ...answers, [item.id]: e.target.value });
                      setChecked(false);
                    }}
                    className="w-full shrink-0 rounded border border-slate-200 bg-white p-1.5 text-[11px] text-slate-700 sm:w-56 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <option value="">Clasificar...</option>
                    {exercise.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
                    checked={Boolean(answers[item.id])}
                    disabled={completed}
                    onChange={(e) => {
                      setAnswers({ ...answers, [item.id]: e.target.checked });
                      setChecked(false);
                    }}
                  />
                  <span className="font-semibold leading-snug text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </label>
              )}

              {(wrong || completed) && (
                <p
                  className={`flex items-start gap-1.5 leading-relaxed ${
                    wrong ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {wrong ? (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{item.why}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div role="status" aria-live="polite" className="text-xs">
        {unanswered && !completed && (
          <p className="text-slate-500 dark:text-slate-400">
            Clasifica todos los elementos antes de verificar.
          </p>
        )}
        {checked && !completed && wrongIds.length > 0 && (
          <p className="font-semibold text-amber-600 dark:text-amber-400">
            {total - wrongIds.length} de {total} correctos. Revisa las pistas en rojo y vuelve a intentarlo.
          </p>
        )}
        {completed && (
          <p className="font-semibold text-emerald-600 dark:text-emerald-400">{exercise.successMessage}</p>
        )}
      </div>

      {!completed && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={reset}
            className="flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar
          </button>
          <button
            type="button"
            onClick={verify}
            className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Verificar respuestas
          </button>
        </div>
      )}
    </section>
  );
}
