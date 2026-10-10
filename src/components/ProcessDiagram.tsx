'use client';

import { ArrowDown, ArrowRight, CheckCircle2, CircleDot, RotateCcw } from 'lucide-react';

const stages = [
  { key: 'Planificar', label: 'PLANIFICAR', detail: 'Contexto, aspectos, requisitos legales y objetivos.', color: 'bg-emerald-600', icon: CircleDot },
  { key: 'Hacer', label: 'HACER', detail: 'Controles operacionales, competencias y respuesta.', color: 'bg-sky-600', icon: CheckCircle2 },
  { key: 'Verificar', label: 'VERIFICAR', detail: 'Indicadores, auditoría interna y revisión directiva.', color: 'bg-amber-500', icon: CircleDot },
  { key: 'Actuar', label: 'ACTUAR', detail: 'No conformidades, acciones correctivas y mejora.', color: 'bg-coral-500', icon: RotateCcw },
];

export default function ProcessDiagram() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6" aria-labelledby="phva-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-lime-300">Mapa de decisión</p>
          <h2 id="phva-title" className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">El ciclo PHVA conecta cada decisión</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">No avances por intuición: cada control debe planificarse, operarse, comprobarse y mejorarse con evidencia.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:bg-emerald-950/50 dark:text-lime-300">ISO 14001 · PHVA</span>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4 md:items-stretch">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.key} className="relative flex min-h-36 flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between">
                <span className={`grid size-9 place-items-center rounded-xl ${stage.color} text-white`}><Icon className="size-5" /></span>
                <span className="font-mono text-[10px] font-black text-slate-400">0{index + 1}</span>
              </div>
              <div><h3 className="text-sm font-black text-slate-900 dark:text-white">{stage.label}</h3><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{stage.detail}</p></div>
              {index < stages.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-white text-emerald-600 md:block dark:bg-slate-900" aria-hidden="true" />}
              {index < stages.length - 1 && <ArrowDown className="mx-auto size-4 text-slate-300 md:hidden" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

