import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = '', iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/green-owl-mark.png"
        alt="Green Owl Labs"
        width={808}
        height={838}
        className="h-11 w-auto object-contain"
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
