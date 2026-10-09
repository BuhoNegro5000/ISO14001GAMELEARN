'use client';

import { useEffect, useState } from 'react';
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
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950 px-6 text-white transition-opacity duration-600 ${closing ? 'pointer-events-none opacity-0' : 'opacity-100'}`} role="status" aria-label="Cargando Green Owl Labs">
      <div className="flex flex-col items-center text-center">
        <div className="rounded-[2rem] border border-lime-300/30 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <Logo className="scale-125" />
        </div>
        <p className="mt-8 font-mono text-xs font-black uppercase tracking-[0.35em] text-lime-300">Innovation Labs</p>
        <p className="mt-3 max-w-sm text-sm leading-6 text-emerald-100">Laboratorio de aprendizaje para diseñar, operar y mejorar tu Sistema de Gestión Ambiental.</p>
        <div className="mt-10 h-1 w-44 overflow-hidden rounded-full bg-white/15"><div className="h-full w-full origin-left animate-[splash-progress_5s_linear] bg-lime-300" /></div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">Preparando tu laboratorio</p>
      </div>
    </div>
  );
}

BrandSplash.displayName = 'BrandSplash';
