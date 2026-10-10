'use client';

import { useEffect, useState } from 'react';

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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 transition-opacity duration-700 ${closing ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(120% 90% at 50% 38%, #ffffff 0%, #eef7ec 55%, #dcefd8 100%)' }}
      role="status"
      aria-label="Cargando Green Owl Labs Innovation Labs"
    >
      <div className="flex w-full max-w-[640px] flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/green-owl-logo.png"
          alt="Green Owl Labs"
          width={1128}
          height={1046}
          className="h-auto w-[min(78vw,460px)] animate-[splash-logo_1.1s_cubic-bezier(0.22,1,0.36,1)_both] drop-shadow-[0_18px_30px_rgba(6,78,59,0.18)] sm:w-[min(60vw,520px)]"
        />

        <div className="mt-6 flex items-center gap-4 text-emerald-900">
          <span className="h-px w-12 bg-emerald-700/40 sm:w-20" aria-hidden="true" />
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.42em] sm:text-sm">Innovation Labs</p>
          <span className="h-px w-12 bg-emerald-700/40 sm:w-20" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm leading-6 text-emerald-950/70">ISO 14001:2026 · Laboratorio de aprendizaje interactivo</p>

        <div className="mt-10 w-full max-w-xs">
          <div className="h-1.5 overflow-hidden rounded-full bg-emerald-900/10">
            <div className="h-full w-full origin-left animate-[splash-progress_5s_linear] rounded-full bg-gradient-to-r from-emerald-700 to-lime-500" />
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900/60">Preparando tu laboratorio</p>
        </div>
      </div>
    </div>
  );
}

BrandSplash.displayName = 'BrandSplash';
