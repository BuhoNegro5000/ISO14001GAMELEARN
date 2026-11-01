'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleDot, RotateCcw, Zap } from 'lucide-react';

const stages = [
  { key: 'Planificar', label: 'PLANIFICAR', code: 'P / 04—06', detail: 'Contexto, aspectos, requisitos legales y objetivos.', color: 'emerald', icon: CircleDot },
  { key: 'Hacer', label: 'HACER', code: 'H / 07—08', detail: 'Controles operacionales, competencias y respuesta.', color: 'cyan', icon: CheckCircle2 },
  { key: 'Verificar', label: 'VERIFICAR', code: 'V / 09', detail: 'Indicadores, auditoría interna y revisión directiva.', color: 'amber', icon: CircleDot },
  { key: 'Actuar', label: 'ACTUAR', code: 'A / 10', detail: 'No conformidades, acciones correctivas y mejora.', color: 'coral', icon: RotateCcw },
] as const;

const colorMap = {
  emerald: { icon: 'bg-emerald-400 text-slate-950', line: 'bg-emerald-400', text: 'text-emerald-300', border: 'border-emerald-400/60', glow: 'shadow-[0_0_34px_rgba(52,211,153,0.24)]' },
  cyan: { icon: 'bg-cyan-300 text-slate-950', line: 'bg-cyan-300', text: 'text-cyan-200', border: 'border-cyan-300/60', glow: 'shadow-[0_0_34px_rgba(103,232,249,0.22)]' },
  amber: { icon: 'bg-amber-300 text-slate-950', line: 'bg-amber-300', text: 'text-amber-200', border: 'border-amber-300/60', glow: 'shadow-[0_0_34px_rgba(252,211,77,0.2)]' },
  coral: { icon: 'bg-rose-400 text-slate-950', line: 'bg-rose-400', text: 'text-rose-200', border: 'border-rose-400/60', glow: 'shadow-[0_0_34px_rgba(251,113,133,0.2)]' },
};

export default function ProcessDiagram() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const palette = colorMap[stage.color];
  const Icon = stage.icon;

  return (
    <section className="relative overflow-hidden border border-cyan-300/20 bg-[#0b1627] p-5 shadow-[8px_8px_0_rgba(4,9,17,0.65)] md:p-7" aria-labelledby="phva-title">
      <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full border border-cyan-300/20" aria-hidden="true" />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hud-label text-[10px] font-black text-lime-300">Decision engine / PHVA</p>
          <h2 id="phva-title" className="mt-2 max-w-xl text-2xl font-black tracking-tight text-white md:text-3xl">El ciclo que convierte criterio en evidencia.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Selecciona una fase para inspeccionar qué se decide, qué se ejecuta y qué evidencia desbloquea la siguiente.</p>
        </div>
        <div className="border border-lime-300/40 bg-lime-300/10 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-widest text-lime-200">ISO 14001 / LOOP_01</div>
      </div>

      <div className="relative mt-8 grid gap-3 md:grid-cols-4">
        <div className="absolute left-[8%] right-[8%] top-8 hidden h-px bg-cyan-300/20 md:block" aria-hidden="true" />
        {stages.map((item, index) => {
          const ItemIcon = item.icon;
          const itemPalette = colorMap[item.color];
          const selected = active === index;
          return (
            <button key={item.key} type="button" onClick={() => setActive(index)} aria-pressed={selected} className={`group relative z-10 min-h-44 border p-4 text-left transition-all duration-200 ${selected ? `${itemPalette.border} ${itemPalette.glow} -translate-y-1 bg-[#14243b]` : 'border-white/10 bg-[#0d1a2d] hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-[#12233a]'}`}>
              <div className="flex items-start justify-between">
                <span className={`grid size-10 place-items-center transition-transform duration-200 group-hover:rotate-6 ${selected ? itemPalette.icon : 'bg-slate-800 text-slate-400'}`}><ItemIcon className="size-5" aria-hidden="true" /></span>
                <span className={`font-mono text-[10px] font-black ${selected ? itemPalette.text : 'text-slate-500'}`}>0{index + 1}</span>
              </div>
              <p className={`mt-5 font-mono text-[10px] font-black uppercase tracking-widest ${selected ? itemPalette.text : 'text-slate-500'}`}>{item.code}</p>
              <h3 className="mt-1 text-base font-black text-white">{item.label}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
              {index < stages.length - 1 && <ArrowRight className="absolute -right-3 top-7 hidden size-5 bg-[#0b1627] text-cyan-300 md:block" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className={`relative mt-4 flex flex-col gap-3 border-l-2 ${palette.border} bg-white/[0.035] p-4 transition-all duration-300 md:flex-row md:items-center md:justify-between`} aria-live="polite">
        <div><p className={`hud-label text-[10px] font-black ${palette.text}`}>Active phase / {stage.code}</p><p className="mt-1 text-sm font-bold text-white">{stage.detail}</p></div>
        <span className="inline-flex items-center gap-2 self-start border border-white/10 px-3 py-2 font-mono text-[10px] font-black uppercase text-slate-300 md:self-auto"><Zap className={`size-3 ${palette.text}`} /> evidence required</span>
      </div>
    </section>
  );
}
