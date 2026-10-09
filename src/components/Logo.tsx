import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = '', iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon: Leaf combined with circular arrows/gear for management system cycles */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md shadow-emerald-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white animate-pulse"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 9.5a7 7 0 0 1-8 8.5Z" />
          <path d="M19 2v9.5" />
          <path d="M11 20a7.5 7.5 0 0 0 8-8.5" />
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-teal-300 border-2 border-white dark:border-slate-900" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white leading-none">
            ENVIRO<span className="text-emerald-500">PRO</span>
          </span>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase leading-none mt-1">
            ISO 14001 SIMULATOR
          </span>
        </div>
      )}
    </div>
  );
}
