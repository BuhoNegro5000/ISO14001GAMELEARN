import React, { useState } from 'react';
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

const method = [
  ['01', 'ASPECTO', '¿Qué actividad genera la interacción?'], ['02', 'IMPACTO', '¿Qué puede cambiar en el ambiente?'], ['03', 'RIESGO', '¿Qué tan grave y probable es?'], ['04', 'CONTROL', '¿Qué barrera lo reduce?'], ['05', 'INDICADOR', '¿Cómo sabrás que funciona?'], ['06', 'EVIDENCIA', '¿Qué registro presentas?']
];

export default function LearningGuide() {
  const [activeOutcome, setActiveOutcome] = useState(0);
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="learning-guide-title">
      <div className="relative overflow-hidden border border-cyan-300/20 bg-[#101d30] p-5 shadow-[6px_6px_0_rgba(4,9,17,0.7)] md:p-6">
        <div className="absolute right-5 top-5 font-mono text-5xl font-black text-white/[0.04]">LAB</div>
        <div className="relative flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center border border-lime-300/60 bg-lime-300 text-slate-950 shadow-[4px_4px_0_rgba(213,255,69,0.18)]"><BookOpen className="size-5" aria-hidden="true" /></span>
          <div><p className="hud-label text-[10px] font-black text-lime-300">Learning lab / mission output</p><h2 id="learning-guide-title" className="mt-2 text-xl font-black text-white">Qué vas a demostrar</h2><p className="mt-1 text-xs leading-5 text-slate-300">Las decisiones de calidad se explican, se evidencian y se mejoran.</p></div>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {outcomes.map((outcome, index) => <button key={outcome} type="button" onClick={() => setActiveOutcome(index)} aria-pressed={activeOutcome === index} className={`flex gap-3 border p-3 text-left text-xs leading-5 transition-all duration-200 ${activeOutcome === index ? 'border-lime-300/60 bg-lime-300/10 text-white shadow-[3px_3px_0_rgba(213,255,69,0.12)]' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-300/40 hover:text-slate-200'}`}><span className={`font-mono text-[10px] font-black ${activeOutcome === index ? 'text-lime-300' : 'text-slate-600'}`}>0{index + 1}</span><span>{outcome}</span></button>)}
        </div>
      </div>

      <div className="border border-cyan-300/20 bg-[#0b1627] p-5 text-white shadow-[6px_6px_0_rgba(4,9,17,0.7)] md:p-6" aria-label="Ciclo de mejora continua">
        <div className="flex items-center gap-2 text-cyan-200"><Compass className="size-4" aria-hidden="true" /><span className="hud-label text-[10px] font-black">Continuous improvement loop</span></div>
        <div className="mt-5 grid gap-2">{loop.map(([title, clauses, detail], index) => <div key={title} className="group flex gap-3 border border-white/10 bg-white/[0.035] p-3 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.06]"><span className="font-mono text-xs font-black text-rose-300">0{index + 1}</span><div><div className="flex items-center gap-2"><strong className="text-xs">{title}</strong><span className="font-mono text-[10px] text-lime-300">Cl. {clauses}</span></div><p className="mt-1 text-[11px] leading-4 text-slate-400">{detail}</p></div></div>)}</div>
      </div>

      <div className="grid gap-4 lg:col-span-2 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="border border-orange-300/50 bg-[#1c1820] p-5 shadow-[6px_6px_0_rgba(4,9,17,0.7)] md:p-6">
          <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center border border-orange-300/60 bg-orange-300 text-slate-950"><Lightbulb className="size-5" aria-hidden="true" /></span><div><p className="hud-label text-[10px] font-black text-orange-200">Decision protocol / 06 nodes</p><h3 className="mt-1 text-lg font-black text-white">Método de juego</h3><p className="mt-1 text-xs leading-5 text-slate-300">Construye la cadena completa antes de verificarla. Cada nodo produce una evidencia accionable.</p></div></div>
          <div className="relative mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{method.map(([number, title, detail], index) => <div key={title} className="group relative border border-orange-300/40 bg-[#0f1727] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-orange-200 hover:bg-[#17243a]"><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-black text-orange-200">{number}</span>{index < 5 && <span className="hidden text-orange-300 lg:block" aria-hidden="true">→</span>}</div><strong className="mt-3 block text-[11px] font-black text-white">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-slate-400">{detail}</span></div>)}</div>
        </div>
        <div className="border border-cyan-300/40 bg-[#0b2031] p-5 shadow-[6px_6px_0_rgba(4,9,17,0.7)] md:p-6"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center border border-cyan-300/60 bg-cyan-300 text-slate-950"><ShieldCheck className="size-4" aria-hidden="true" /></span><div><p className="hud-label text-[10px] font-black text-cyan-200">Integrity notice</p><h3 className="mt-1 text-base font-black text-white">Nota de rigor</h3><p className="mt-2 text-xs leading-5 text-slate-300">La simulación entrena criterios de ISO 14001:2026. No reemplaza el texto oficial ni una auditoría acreditada.</p></div></div></div>
      </div>
    </section>
  );
}

LearningGuide.displayName = 'LearningGuide';
