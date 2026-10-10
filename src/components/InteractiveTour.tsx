'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Map, X } from 'lucide-react';

type TourStep = { title: string; body: string; icon: typeof BookOpen };

const steps: TourStep[] = [
  { title: '1. Lee tu misión', body: 'El dashboard siempre te muestra el siguiente reto. No intentes subir todos los indicadores a la vez: sigue la recomendación y protege tu presupuesto.', icon: BookOpen },
  { title: '2. Explora la planta', body: 'En Mapa de Planta identifica aspectos ambientales, riesgos y controles. Una buena decisión conecta impacto, control e indicador.', icon: Map },
  { title: '3. Construye evidencia', body: 'En Cláusulas y Document Center convierte tus decisiones en requisitos, responsables, documentos y registros auditables.', icon: CheckCircle2 },
  { title: '4. Avanza y aprende', body: 'Cada semana cambia el contexto. Revisa el feedback, ajusta el SGA y llega a la auditoría con evidencia, no solo con un buen promedio.', icon: CheckCircle2 },
];

export default function InteractiveTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  if (!open) return null;
  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-emerald-950/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-emerald-200/30 bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div><p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-lime-300">Guía de juego · {step + 1}/{steps.length}</p><h2 id="tour-title" className="mt-1 text-lg font-black text-slate-900 dark:text-white">Cómo jugar el laboratorio</h2></div>
          <button type="button" onClick={onClose} aria-label="Cerrar guía" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="size-5" /></button>
        </div>
        <div className="p-6">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-lime-200 text-emerald-950"><Icon className="size-7" /></div>
          <h3 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">{current.title}</h3>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{current.body}</p>
          <div className="mt-6 flex gap-2" aria-label="Progreso de la guía">{steps.map((item, index) => <span key={item.title} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-emerald-700' : 'bg-slate-200 dark:bg-slate-700'}`} />)}</div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 disabled:opacity-30 dark:text-slate-300"><ArrowLeft className="size-4" /> Atrás</button>
          <button type="button" onClick={() => step === steps.length - 1 ? onClose() : setStep((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700">{step === steps.length - 1 ? 'Empezar a jugar' : 'Siguiente'} <ArrowRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
