import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = '', iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_GOWL-lZoMBFzv3ekbXEIOVUGXAwbpE090UX.png"
        alt="Green Owl Labs"
        className="h-10 w-10 rounded-xl object-cover"
      />
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-emerald-900 dark:text-emerald-100">
            Green Owl Labs
          </span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            ISO 14001:2026 · Learning Lab
          </span>
        </div>
      )}
    </div>
  );
}
