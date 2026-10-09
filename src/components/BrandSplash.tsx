'use client';

import { useEffect, useState } from 'react';
import { Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

export default function BrandSplash({ onComplete }: { onComplete: () => void }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => setClosing(true), 4600);
    const completeTimer = window.setTimeout(onComplete, 5200);
    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#062e2b] px-5 text-white transition-opacity duration-700 ${closing ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="status"
      aria-label="Cargando Green Owl Labs Innovation Labs"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute -left-24 top-16 size-72 rounded-full border border-lime-200/30" />
        <div className="absolute -right-32 bottom-8 size-96 rounded-full border border-lime-200/20" />
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-lime-100/15" />
      </div>

      <div className="relative flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.32em] text-lime-200/80">
          <span className="h-px w-10 bg-lime-200/40" />
          <span>Learning environment</span>
          <span className="h-px w-10 bg-lime-200/40" />
        </div>

        <div className="grid size-32 place-items-center rounded-[2.25rem] border border-lime-200/50 bg-lime-100 p-3 shadow-[0_24px_80px_rgba(163,230,53,0.18)]">
          <div className="grid size-full place-items-center rounded-[1.7rem] border border-emerald-950/10 bg-white shadow-inner">
            <Logo iconOnly className="scale-[1.75]" />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="text-[clamp(1.6rem,5vw,2.6rem)] font-black leading-none tracking-[-0.06em] text-white">Green Owl Labs</p>
          <div className="mt-4 flex items-center gap-3 text-lime-300">
            <Leaf className="size-4" aria-hidden="true" />
            <p className="font-mono text-xs font-black uppercase tracking-[0.34em]">Innovation Labs</p>
            <Leaf className="size-4 scale-x-[-1]" aria-hidden="true" />
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-emerald-100/80">Laboratorio interactivo para diseñar, operar y mejorar sistemas de gestión ambiental.</p>
        </div>

        <div className="mt-10 grid w-full max-w-sm grid-cols-3 gap-2 text-left">
          {[
            { icon: ShieldCheck, label: 'ISO 14001' },
            { icon: Sparkles, label: 'Aprendizaje' },
            { icon: Leaf, label: 'Impacto real' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-3 backdrop-blur-sm">
              <Icon className="size-4 text-lime-300" aria-hidden="true" />
              <span className="text-center text-[9px] font-black uppercase tracking-[0.12em] text-emerald-100/70">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 w-full max-w-xs">
          <div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full origin-left animate-[splash-progress_5s_linear] rounded-full bg-lime-300" /></div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/70">Preparando tu laboratorio · 5 segundos</p>
        </div>
      </div>
    </div>
  );
}

BrandSplash.displayName = 'BrandSplash';
