import React from 'react';
import { BookOpen, CheckCircle2, Compass, Lightbulb, ShieldCheck } from 'lucide-react';

const outcomes = [
  'Interpretar el contexto, las partes interesadas y el alcance del SGA.',
  'Priorizar aspectos ambientales con criterios transparentes y ciclo de vida.',
  'Convertir obligaciones, objetivos y riesgos en controles con evidencia.',
  'Verificar desempeño, corregir causas y preparar una auditoría interna.'
];

const loop = [
  ['Planificar', '4–6', 'Contexto, liderazgo, aspectos, obligaciones y objetivos.'],
  ['Hacer', '7–8', 'Recursos, competencia, comunicación, operación y emergencias.'],
  ['Verificar', '9', 'Indicadores, evaluación de cumplimiento y auditoría interna.'],
  ['Mejorar', '10', 'No conformidad, causa raíz, acción correctiva y aprendizaje.']
];

export default function LearningGuide() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="learning-guide-title">
      <div className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-lime-100 text-emerald-800 dark:bg-emerald-950 dark:text-lime-300">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-lime-300">Laboratorio de aprendizaje</p>
            <h2 id="learning-guide-title" className="mt-1 text-lg font-black text-slate-900 dark:text-white">Qué vas a demostrar</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">No gana quien acumula puntos: gana quien puede explicar la decisión, mostrar evidencia y mejorar el desempeño.</p>
          </div>
        </div>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-2 rounded-2xl bg-emerald-50/70 p-3 text-xs leading-5 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-lime-300" aria-hidden="true" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm dark:border-slate-800" aria-label="Ciclo de mejora continua">
        <div className="flex items-center gap-2 text-lime-300">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ciclo de mejora</span>
        </div>
        <div className="mt-4 grid gap-2">
          {loop.map(([title, clauses, detail], index) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="font-mono text-xs font-black text-coral-300">0{index + 1}</span>
              <div>
                <div className="flex items-center gap-2"><strong className="text-xs">{title}</strong><span className="text-[10px] text-lime-300">Cl. {clauses}</span></div>
                <p className="mt-1 text-[11px] leading-4 text-slate-300">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3"><Lightbulb className="mt-1 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" /><div className="min-w-0"><h3 className="text-xs font-black uppercase tracking-wide text-amber-950 dark:text-amber-100">Método de juego</h3><p className="mt-1 text-xs leading-5 text-amber-900/80 dark:text-amber-100/70">Construye la decisión completa antes de verificarla. Cada nodo responde una pregunta y produce una evidencia.</p></div></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[['01','Aspecto','¿Qué actividad genera la interacción?'],['02','Impacto','¿Qué puede cambiar en el ambiente?'],['03','Riesgo','¿Qué tan grave y probable es?'],['04','Control','¿Qué barrera lo reduce?'],['05','Indicador','¿Cómo sabrás que funciona?'],['06','Evidencia','¿Qué registro presentas?']].map(([number,title,detail], index) => (
              <div key={title} className="relative rounded-2xl border border-amber-300/70 bg-white/80 p-3 shadow-sm dark:border-amber-800 dark:bg-slate-950/40">
                <div className="flex items-center justify-between"><span className="font-mono text-[10px] font-black text-amber-700 dark:text-amber-300">{number}</span>{index < 5 && <span className="hidden text-amber-400 lg:block" aria-hidden="true">→</span>}</div>
                <strong className="mt-2 block text-[11px] font-black text-amber-950 dark:text-amber-100">{title}</strong>
                <span className="mt-1 block text-[10px] leading-4 text-amber-900/70 dark:text-amber-100/60">{detail}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-900/50 dark:bg-sky-950/20">
          <div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" /><div><h3 className="text-xs font-black uppercase tracking-wide text-sky-950 dark:text-sky-100">Nota de rigor</h3><p className="mt-1 text-xs leading-5 text-sky-900/80 dark:text-sky-100/70">La simulación entrena criterios de ISO 14001:2026. No reemplaza el texto oficial, la identificación legal de tu país ni una auditoría de certificación acreditada.</p></div></div>
        </div>
      </div>
    </section>
  );
}

LearningGuide.displayName = 'LearningGuide';
