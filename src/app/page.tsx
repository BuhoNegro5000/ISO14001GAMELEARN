'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Logo from '@/components/Logo';
import CompanyAreas from '@/components/CompanyAreas';
import IsoModules from '@/components/IsoModules';
import DocumentCenter from '@/components/DocumentCenter';
import AiConsole from '@/components/AiConsole';
import FinalAudit from '@/components/FinalAudit';
import LearningGuide from '@/components/LearningGuide';
import ProcessDiagram from '@/components/ProcessDiagram';
import InteractiveTour from '@/components/InteractiveTour';
import BrandSplash from '@/components/BrandSplash';

// Icons
import { 
  LayoutDashboard, Map, FolderEdit, Bot, Award, ChevronRight, 
  Sun, Moon, ShieldCheck, Scale, Coins, 
  TrendingUp, Calendar, HelpCircle, Play, FileText,
  X, ChevronLeft, Info, UserRound, Target
} from 'lucide-react';

const companyThemes = {
  metal: {
    accent: 'emerald',
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/20 border-emerald-500/30',
    bgHover: 'hover:bg-emerald-600',
    shadow: 'shadow-emerald-500/10',
    badge: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    ring: 'focus:ring-emerald-500',
    gradient: 'from-emerald-500/10 to-teal-500/10'
  },
  chem: {
    accent: 'purple',
    text: 'text-purple-500',
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-500/10',
    border: 'border-purple-500/20 border-purple-500/30',
    bgHover: 'hover:bg-purple-600',
    shadow: 'shadow-purple-500/10',
    badge: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    ring: 'focus:ring-purple-500',
    gradient: 'from-purple-500/10 to-pink-500/10'
  },
  power: {
    accent: 'sky',
    text: 'text-sky-500',
    bg: 'bg-sky-500',
    bgLight: 'bg-sky-500/10',
    border: 'border-sky-500/20 border-sky-500/30',
    bgHover: 'hover:bg-sky-600',
    shadow: 'shadow-sky-500/10',
    badge: 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
    ring: 'focus:ring-sky-500',
    gradient: 'from-sky-500/10 to-cyan-500/10'
  },
  mine: {
    accent: 'amber',
    text: 'text-amber-500',
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/10',
    border: 'border-amber-500/20 border-amber-500/30',
    bgHover: 'hover:bg-amber-600',
    shadow: 'shadow-amber-500/10',
    badge: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    ring: 'focus:ring-amber-500',
    gradient: 'from-amber-500/10 to-yellow-500/10'
  },
  oil: {
    accent: 'orange',
    text: 'text-orange-500',
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-500/10',
    border: 'border-orange-500/20 border-orange-500/30',
    bgHover: 'hover:bg-orange-600',
    shadow: 'shadow-orange-500/10',
    badge: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    ring: 'focus:ring-orange-500',
    gradient: 'from-orange-500/10 to-red-500/10'
  },
  airport: {
    accent: 'indigo',
    text: 'text-indigo-500',
    bg: 'bg-indigo-500',
    bgLight: 'bg-indigo-500/10',
    border: 'border-indigo-500/20 border-indigo-500/30',
    bgHover: 'hover:bg-indigo-600',
    shadow: 'shadow-indigo-500/10',
    badge: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400',
    ring: 'focus:ring-indigo-500',
    gradient: 'from-indigo-500/10 to-violet-500/10'
  }
};

export default function GameMain() {
  const store = useGameStore();
  const { 
    currentCompanyId, companies, switchCompany,
    week, budget, legalCompliance, environmentalScore, reputation, 
    operationalRisk, certificationProbability, xp, level, badges, 
    newsFeed, tickWeek, certificationStatus 
  } = store;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'iso' | 'docs' | 'ai' | 'audit'>('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [profileRole, setProfileRole] = useState('');
  const [showTour, setShowTour] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Apply dark class to html document
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((current) => !current);
  };

  const handleNextWeek = () => {
    tickWeek();
  };

  // XP needed for next level
  const xpNeeded = level * 1000;
  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  const badgesInfo: Record<string, { label: string; desc: string; icon: string }> = {
    policy_approved: { label: 'Líder Verde', desc: 'Política ambiental firmada por el CEO.', icon: '✍️' },
    aspects_mapped: { label: 'Gestor de Cambios', desc: 'Cláusula 6.3 completada y aspectos mapeados.', icon: '🧱' },
    legal_compliant: { label: 'Legalmente Apto', desc: 'Cumplimiento legal regulatorio al 100%.', icon: '⚖️' },
    audit_ready: { label: 'Listo para Certificar', desc: 'Probabilidad de certificación mayor al 80%.', icon: '📋' },
    green_energy: { label: 'Cero Fósiles', desc: 'Transición a energías renovables y eficiencia LED.', icon: '☀️' },
    zero_spill: { label: 'Protector de Suelo', desc: 'Implementación de diques, geomembranas o cubetos.', icon: '🛡️' }
  };

  const activeCompany = companies[currentCompanyId];
  const theme = companyThemes[currentCompanyId] || companyThemes.metal;
  const learningProgress = Math.min(100, Math.round(((week - 1) / 12) * 100));
  const mission = certificationStatus === 'certified'
    ? { eyebrow: 'Misión completada', title: 'Tu SGA está listo para sostener la certificación', detail: 'Revisa tu informe final y compara las decisiones que elevaron el desempeño.', tab: 'audit' as const, action: 'Ver informe final' }
    : week <= 2
      ? { eyebrow: 'Misión 01 · Contexto', title: 'Define el terreno antes de invertir', detail: 'Analiza el contexto, el cambio climático y el alcance del SGA en la pestaña Cláusulas.', tab: 'iso' as const, action: 'Abrir Cláusulas 4–10' }
      : environmentalScore < 65
        ? { eyebrow: 'Misión 02 · Impactos', title: 'Convierte riesgos en controles operativos', detail: 'Explora las áreas con mayor riesgo y activa controles que reduzcan impactos sin agotar el presupuesto.', tab: 'map' as const, action: 'Explorar mapa de planta' }
        : legalCompliance < 100
          ? { eyebrow: 'Misión 03 · Cumplimiento', title: 'Cierra las brechas legales antes de auditar', detail: 'Una certificación no se gana con promedios: cada requisito aplicable debe tener evidencia y seguimiento.', tab: 'iso' as const, action: 'Revisar requisitos' }
          : { eyebrow: 'Misión 04 · Evidencia', title: 'Prepara tu organización para la auditoría', detail: 'Ordena documentos, entrena al equipo y usa el Consultor IA para ensayar preguntas de auditor.', tab: 'docs' as const, action: 'Preparar evidencias' };

  const learningPhases = [
    { label: 'Comprender', range: '4–5', done: week > 2 },
    { label: 'Planificar', range: '6–7', done: week > 5 },
    { label: 'Operar', range: '8', done: week > 7 },
    { label: 'Mejorar', range: '9–10', done: certificationStatus === 'certified' }
  ];

  return (
    <div data-font-scale={fontScale} className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {showSplash && <BrandSplash onComplete={() => setShowSplash(false)} />}
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Logo />
          <button 
            onClick={toggleDarkMode}
            className="sm:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350 cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Game stats */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <div className="hidden items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 sm:flex">
            <UserRound className="h-4 w-4 text-emerald-700" />
            <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Jugador</span><span className="text-xs font-black text-emerald-950">{playerName || 'Perfil nuevo'}</span></div>
          </div>
          {/* Week counter */}
          <div className="flex items-center gap-2.5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 px-3.5 py-2 rounded-2xl">
            <Calendar className={`w-4 h-4 ${theme.text}`} />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Turno / Tiempo</span>
              <span className="text-xs font-black">Semana {week} / 52</span>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2.5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 px-3.5 py-2 rounded-2xl">
            <Coins className="w-4 h-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Presupuesto</span>
              <span className="text-xs font-black">${budget.toLocaleString('es-ES')}</span>
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="flex items-center gap-2.5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 px-3.5 py-2 rounded-2xl">
            <Scale className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Cumplimiento Legal</span>
              <span className="text-xs font-black text-blue-500">{legalCompliance}%</span>
            </div>
          </div>

          {/* Environmental Score */}
          <div className="flex items-center gap-2.5 bg-slate-100/50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 px-3.5 py-2 rounded-2xl">
            <ShieldCheck className={`w-4 h-4 ${theme.text}`} />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score Ambiental</span>
              <span className={`text-xs font-black ${theme.text}`}>{environmentalScore}%</span>
            </div>
          </div>

          {/* Time tick button */}
          {certificationStatus !== 'certified' && (
            <button
              onClick={handleNextWeek}
              className={`px-4 py-2.5 ${theme.bg} ${theme.bgHover} text-white font-bold text-xs rounded-xl shadow-md ${theme.shadow} cursor-pointer flex items-center gap-1.5 transition-all`}
            >
              <Play className="w-3.5 h-3.5" /> Avanzar Semana
            </button>
          )}

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowTour(true)} aria-label="Abrir guía interactiva" title="Cómo jugar" className="rounded-xl bg-lime-200 p-2.5 text-emerald-900 transition hover:bg-lime-300"><HelpCircle className="size-4" /></button>
            <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setFontScale((current) => current === 'normal' ? 'large' : 'normal')}
              aria-pressed={fontScale === 'large'}
              aria-label={fontScale === 'large' ? 'Usar tamaño de letra normal' : 'Aumentar tamaño de letra'}
              title="Ajustar tamaño de letra"
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-lime-200 dark:bg-slate-800 dark:text-slate-300"
            >A<span className="text-base">A</span>
            </button>
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-pressed={isDark}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="rounded-xl bg-slate-100 p-2.5 text-slate-500 transition hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Left Menu */}
        <aside className="w-full md:w-64 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-5">
            {/* Multi-company Selector */}
            <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-2xs">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Empresa a Certificar
              </span>
              <select
                value={currentCompanyId}
                onChange={(e) => switchCompany(e.target.value as 'metal' | 'chem' | 'power' | 'mine' | 'oil' | 'airport')}
                className={`text-xs font-extrabold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 ${theme.ring} cursor-pointer shadow-3xs`}
              >
                <option value="metal">⚙️ Metalmecánica</option>
                <option value="chem">🧪 Agroquímica</option>
                <option value="power">⚡ EcoPower Refinería</option>
                <option value="mine">🏆 Minería de Oro</option>
                <option value="oil">🛢️ Petróleo & Gas</option>
                <option value="airport">✈️ Aeropuerto</option>
              </select>
              <div className="px-1 text-[9px] text-slate-400 font-extrabold truncate uppercase tracking-wide">
                {activeCompany?.sector}
              </div>
            </div>

            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
              Menú Principal
            </span>
            
            <nav className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? `${theme.bg} text-white shadow-md ${theme.shadow}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" /> Dashboard
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${
                  activeTab === 'map'
                    ? `${theme.bg} text-white shadow-md ${theme.shadow}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Map className="w-4.5 h-4.5" /> Mapa de Planta
              </button>

              <button
                onClick={() => setActiveTab('iso')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${
                  activeTab === 'iso'
                    ? `${theme.bg} text-white shadow-md ${theme.shadow}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <FolderEdit className="w-4.5 h-4.5" /> Cláusulas SGA
              </button>

              <button
                onClick={() => setActiveTab('docs')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${
                  activeTab === 'docs'
                    ? `${theme.bg} text-white shadow-md ${theme.shadow}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <FileText className="w-4.5 h-4.5" /> Document Center
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-3 p-3 rounded-xl text-left font-bold transition-all ${
                  activeTab === 'ai'
                    ? `${theme.bg} text-white shadow-md ${theme.shadow}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Bot className="w-4.5 h-4.5" /> Consultor IA
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-bold transition-all ${
                  activeTab === 'audit'
                    ? `${theme.bg} text-white shadow-md ${theme.shadow}`
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className="flex items-center gap-3"><Award className="w-4.5 h-4.5" /> Auditoría Final</span>
                {certificationStatus === 'certified' && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-600 rounded px-1">CERT</span>
                )}
              </button>
            </nav>
          </div>

          {/* Level and XP progress panel */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Progreso Global</span>
              <span className={`text-[10px] font-bold ${theme.text} uppercase tracking-widest ${theme.bgLight} px-1.5 py-0.5 rounded`}>Nivel {level}</span>
            </div>

            <div className="flex flex-col gap-1 text-[10px]">
              <div className="flex justify-between text-slate-400">
                <span>XP total: {xp}</span>
                <span>Siguiente: {xpNeeded}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className={`${theme.bg} h-1.5 rounded-full transition-all duration-300`}
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Badges Shelf */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest">Logros Obtenidos</span>
              <div className="flex flex-wrap gap-1.5">
                {badges.length > 0 ? (
                  badges.map((b) => (
                    <span 
                      key={b} 
                      className="text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-7 h-7 rounded-lg flex items-center justify-center shadow-2xs cursor-help"
                      title={`${badgesInfo[b]?.label || b}: ${badgesInfo[b]?.desc || ''}`}
                    >
                      {badgesInfo[b]?.icon || '🏆'}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 italic font-medium">Ninguno aún.</span>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-emerald-950 p-6 text-white shadow-xl shadow-emerald-950/10 md:p-7" aria-labelledby="mission-title">
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[22px] border-lime-300/70" aria-hidden="true" />
                <div className="absolute bottom-5 right-28 h-5 w-5 rotate-45 bg-[var(--color-coral)]" aria-hidden="true" />
                <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-lime-300">
                      <Target className="h-4 w-4" /> {mission.eyebrow}
                    </div>
                    <h1 id="mission-title" className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight md:text-3xl">{mission.title}</h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">{mission.detail}</p>
                    <button onClick={() => setActiveTab(mission.tab)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-xs font-black text-emerald-950 transition hover:-translate-y-0.5 hover:bg-lime-200">
                      {mission.action} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-100"><span>Ruta de aprendizaje</span><span>{learningProgress}%</span></div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-900"><div className="h-full rounded-full bg-lime-300 transition-all" style={{ width: `${learningProgress}%` }} /></div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {learningPhases.map((phase) => <div key={phase.label} className="flex flex-col gap-1"><span className={`h-2 rounded-full ${phase.done ? 'bg-lime-300' : 'bg-white/20'}`} /><span className="text-[9px] font-bold leading-tight text-emerald-100">{phase.label}</span><span className="text-[9px] text-emerald-300">§{phase.range}</span></div>)}
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3" aria-label="Cómo jugar">
                {[['01', 'Diagnostica', 'Lee el contexto y detecta aspectos significativos.'], ['02', 'Decide', 'Invierte presupuesto en controles con evidencia.'], ['03', 'Demuestra', 'Documenta, entrena y supera la auditoría.']].map(([number, title, detail]) => <div key={number} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><span className="font-mono text-xs font-black text-coral-500">{number}</span><div><h2 className="text-xs font-black uppercase tracking-wide text-slate-800 dark:text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</p></div></div>)}
              </section>

              <LearningGuide />
              <ProcessDiagram />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              
              {/* Quick executive summary gauges */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Reputación</span>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{reputation}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${reputation}%` }} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Riesgo Op.</span>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className={`text-2xl font-black ${operationalRisk > 60 ? 'text-rose-500' : theme.text}`}>
                      {operationalRisk}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full ${operationalRisk > 60 ? 'bg-rose-500' : theme.bg}`} style={{ width: `${operationalRisk}%` }} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Certificación</span>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className={`text-2xl font-black ${theme.text}`}>{certificationProbability}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full ${theme.bg}`} style={{ width: `${certificationProbability}%` }} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">Carbono Total</span>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">
                      {Math.round((activeCompany.carbonScope1 + activeCompany.carbonScope2 + activeCompany.carbonScope3) / 1000)}k
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">tCO2e</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              {/* Status and Carbon details */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Main sector badge & welcome card */}
                <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xs`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${theme.accent}-500/5 rounded-full translate-x-5 -translate-y-5`} />
                  <div>
                    <span className={`text-[9px] ${theme.bg} text-white font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider`}>
                      SGA Activo • ISO 14001:2026
                    </span>
                    <h2 className="text-lg font-black text-slate-800 dark:text-white mt-2">
                      {activeCompany.name}
                    </h2>
                    <p className="text-xs text-slate-650 dark:text-slate-350 mt-1 leading-normal">
                      {activeCompany.description}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <span>SECTOR: {activeCompany.sector}</span>
                    <span>SGA v4.0</span>
                  </div>
                </div>

                {/* News & incident feed */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                    <TrendingUp className={`w-4.5 h-4.5 ${theme.text}`} /> Bitácora de Eventos e Infracciones
                  </h3>

                  <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {newsFeed.map((feed) => {
                      let typeClass = 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                      if (feed.type === 'error') typeClass = 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-500/10 text-rose-600 dark:text-rose-400';
                      else if (feed.type === 'success') typeClass = `${theme.bgLight} border-${theme.accent}-500/10 ${theme.text}`;
                      else if (feed.type === 'warning') typeClass = 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-500/10 text-amber-600 dark:text-amber-400';
                      
                      return (
                        <div key={feed.id} className={`p-3 rounded-2xl border text-xs leading-normal flex items-start gap-2.5 transition-all ${typeClass}`}>
                          <span className="font-extrabold text-[10px] mt-0.5 opacity-60">W{feed.week}</span>
                          <span className="font-bold flex-1">{feed.message}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Guide card */}
              <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <HelpCircle className={`w-4.5 h-4.5 ${theme.text}`} /> Diagnóstico de la Planta
                </h3>
                <div className="flex flex-col gap-3.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  <p>
                    {currentCompanyId === 'metal' && 'La planta metalmecánica presenta brechas críticas en vertimientos y segregación:'}
                    {currentCompanyId === 'chem' && 'La planta agroquímica maneja insumos corrosivos e inflamables con alta peligrosidad:'}
                    {currentCompanyId === 'power' && 'La refinería de biocombustibles debe asegurar trazabilidad en su cadena de soja y agua:'}
                    {currentCompanyId === 'mine' && 'La operación minera de oro a tajo abierto tiene riesgos altos en agua y suelo:'}
                    {currentCompanyId === 'oil' && 'El yacimiento onshore y refino de crudo presenta riesgos en oleoductos y antorchas:'}
                    {currentCompanyId === 'airport' && 'El aeropuerto internacional debe mitigar su huella indirecta de carbono y acústica:'}
                  </p>
                  <ul className="list-disc pl-4 space-y-2 text-[11px]">
                    {currentCompanyId === 'metal' && (
                      <>
                        <li><strong>Producción</strong>: Consumo eléctrico IE2 muy elevado (Scope 2).</li>
                        <li><strong>Almacén</strong>: Cilindros químicos sobre suelo sin diques de contención.</li>
                        <li><strong>Planta de Tratamiento</strong>: Descargas de efluentes superan LMP de grasas y aceites.</li>
                        <li><strong>Patio de Residuos</strong>: Acopio de chatarra desprotegido genera lixiviados de óxidos.</li>
                      </>
                    )}
                    {currentCompanyId === 'chem' && (
                      <>
                        <li><strong>Reactores</strong>: Alta emisión gaseosa de vapores ácidos y COVs sin scrubber.</li>
                        <li><strong>Almacén Químico</strong>: Bidones de reactivos concentrados sin cubetos de retención.</li>
                        <li><strong>Tratamiento</strong>: Trazas de plaguicidas de síntesis vertidos directo al alcantarillado.</li>
                        <li><strong>Patio de Residuos</strong>: Ausencia de techado en tambores de lodos tóxicos sedimentados.</li>
                      </>
                    )}
                    {currentCompanyId === 'power' && (
                      <>
                        <li><strong>Destilación</strong>: Gran consumo de calor/vapor con pérdida de vapor residual.</li>
                        <li><strong>Compras Agrícolas</strong>: Soya sin certificación de deforestación cero (Scope 3).</li>
                        <li><strong>Planta de Recirculación</strong>: Gran consumo de agua fresca en sequía extrema.</li>
                        <li><strong>Depósito</strong>: Riesgo de filtración invisible de biocombustibles al acuífero.</li>
                      </>
                    )}
                    {currentCompanyId === 'mine' && (
                      <>
                        <li><strong>Tajo Abierto</strong>: Emisión descontrolada de polvo de voladuras (PM10) en comunidad.</li>
                        <li><strong>Pad Lixiviación</strong>: Suelos expuestos a solución de cianuro sin geomembrana doble.</li>
                        <li><strong>Presa de Relaves</strong>: Formación inminente de Drenaje Ácido de Roca (DAR) por sulfuros expuestos.</li>
                        <li><strong>Asuntos Sociales</strong>: Hostilidad vecinal por presunta contaminación del río local.</li>
                      </>
                    )}
                    {currentCompanyId === 'oil' && (
                      <>
                        <li><strong>Pozos Terrestres</strong>: Acumulación de lodos de perforación base aceite en zanjas abiertas.</li>
                        <li><strong>Refinería</strong>: Quemado continuo de gas residual en antorcha (flaring) sin recuperación.</li>
                        <li><strong>Oleoducto</strong>: Tuberías expuestas a corrosión agresiva en cruce fluvial.</li>
                        <li><strong>Remediación</strong>: Pasivos históricos de suelo impactado por crudo sin tratamiento.</li>
                      </>
                    )}
                    {currentCompanyId === 'airport' && (
                      <>
                        <li><strong>Pistas</strong>: Aterrizajes nocturnos sin restricción de ruido acústico.</li>
                        <li><strong>Rampa (GSE)</strong>: Equipos terrestres antiguos a diésel con emisiones masivas (Scope 1).</li>
                        <li><strong>Granja Combustible</strong>: Tuberías subterráneas sin protección catódica contra fugas.</li>
                        <li><strong>Terminal</strong>: Consumo eléctrico elevado e ineficiente en climatización y residuos de pasajeros.</li>
                      </>
                    )}
                  </ul>
                  <p>
                    Ve al <strong>Mapa de Planta</strong>, implementa los controles operativos adecuados y luego habla con el <strong>Auditor IA</strong> en la Consola.
                  </p>
                </div>
              </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && <CompanyAreas key={currentCompanyId} />}

          {activeTab === 'iso' && <IsoModules key={currentCompanyId} />}

          {activeTab === 'docs' && <DocumentCenter key={currentCompanyId} />}

          {activeTab === 'ai' && <AiConsole key={currentCompanyId} />}

          {activeTab === 'audit' && <FinalAudit key={currentCompanyId} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900 py-3 px-6 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex justify-between items-center gap-4">
        <span>{activeCompany?.name} © 2026 - Certificación de Sistemas de Gestión Ambiental</span>
        <span>ISO 14001:2026 (4a Edición)</span>
      </footer>

      {/* Green Owl Labs onboarding */}
      {showProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-emerald-950/90 px-4 py-8 backdrop-blur-sm">
          <div className="memphis-dot memphis-dot-lime" aria-hidden="true" />
          <div className="memphis-star" aria-hidden="true">+</div>
          <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-200/20 bg-[#f7f8ee] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-emerald-900 p-8 text-white md:p-12">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-lime-400/80" aria-hidden="true" />
              <div className="absolute bottom-12 right-10 h-7 w-7 rotate-45 bg-lime-400" aria-hidden="true" />
              <Logo className="relative" />
              <div className="relative mt-auto pt-20">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-lime-300">Learning Lab 02</p>
                <h1 className="mt-4 max-w-md text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">Conviértete en arquitecto ambiental.</h1>
                <p className="mt-5 max-w-sm text-sm leading-6 text-emerald-100">Aprende ISO 14001:2026 tomando decisiones reales, gestionando riesgos y llevando una organización hasta la certificación.</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-emerald-950"><UserRound className="h-5 w-5" /></div>
                <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Tu perfil de misión</p><p className="text-sm text-slate-500">Personaliza tu experiencia de aprendizaje</p></div>
              </div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-700" htmlFor="player-name">¿Cómo te llamamos?</label>
              <input id="player-name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Tu nombre o alias" className="mt-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-600" />
              <label className="mt-5 text-xs font-black uppercase tracking-wider text-slate-700" htmlFor="player-role">Tu rol profesional</label>
              <select id="player-role" value={profileRole} onChange={(event) => setProfileRole(event.target.value)} className="mt-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-600">
                <option value="">Selecciona una opción</option><option value="manager">Manager ambiental</option><option value="auditor">Auditor interno</option><option value="student">Estudiante</option><option value="leader">Líder de operaciones</option>
              </select>
              <button disabled={!playerName.trim() || !profileRole} onClick={() => setShowProfile(false)} className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">Entrar al laboratorio <ChevronRight className="h-4 w-4" /></button>
              <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">Tu perfil se usa para personalizar el recorrido. No necesitas una cuenta para comenzar.</p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Wizard Modal */}
      {showWelcome && !showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4 py-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
            
            {/* Header */}
            <div className="border-b border-slate-100 dark:border-slate-850 px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Logo />
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Guía Académica 2026
                </span>
              </div>
              <button 
                onClick={() => setShowWelcome(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slides container */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              
              {welcomeStep === 0 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950 rounded-2xl text-emerald-600 dark:text-emerald-400">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-white">
                        SGA EHS Manager: Edición ISO 14001:2026
                      </h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Simulador de Aprendizaje Activo (Doing to Learning)
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mt-2">
                    ¡Bienvenido a bordo! Has sido contratado como <strong>EHS Environmental Manager</strong>. Tu misión principal es diseñar, implementar, auditar y certificar el Sistema de Gestión Ambiental (SGA) de la planta asignada.
                  </p>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/10 rounded-2xl flex gap-3.5 mt-2">
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                        ¡REQUISITO CLAVE DE LA VERSIÓN ISO 14001:2026!
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-normal">
                        La nueva norma 2026 integra obligatoriamente la relevancia del <strong>Cambio Climático (§4.1/4.2)</strong>. Deberás evaluar formalmente cómo el aumento de sequías, estrés hídrico y temperaturas extremas impactan la operación de tu planta y las exigencias de tus partes interesadas.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Haz clic en <strong>Siguiente</strong> para ver el flujo de la norma y cómo se organiza este simulador.
                  </p>
                </div>
              )}

              {welcomeStep === 1 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-emerald-500" /> El Proceso del SGA: Estructura del Simulador
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                    Para lograr la certificación, deberás trabajar secuencialmente a través de las pestañas del menú izquierdo:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-3">
                      <span className="text-xl">4️⃣</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Contexto & Clima</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Determina el alcance de la planta y evalúa la influencia del cambio climático.</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-3">
                      <span className="text-xl">6️⃣</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Aspectos e Impactos</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Mapea los aspectos (ruido, cianuro, derrames) y califica su severidad.</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-3">
                      <span className="text-xl">8️⃣</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Control Operacional</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Invierte presupuesto en tecnologías de ingeniería (diques, scrubbers, alarmas).</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex gap-3">
                      <span className="text-xl">📋</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Auditoría & Mejora</span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Ejecuta simulacros de auditoría, soluciona no conformidades y certifícate.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {welcomeStep === 2 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FolderEdit className="w-5 h-5 text-emerald-500" /> El Gestor Documental Profesional (DMS)
                  </h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                    Un pilar fundamental de la auditoría es la **información documentada (§7.5)**. Hemos diseñado un Gestor Documental corporativo de alto nivel:
                  </p>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-250/50 dark:border-slate-850 rounded-2xl flex gap-4 mt-2">
                    <div className="w-1/2 flex flex-col gap-1.5 border-r border-slate-200 dark:border-slate-850 pr-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300">📂 Organización Avanzada</span>
                      <p>Los documentos se agrupan en carpetas del SGA (Contexto, Planificación, Operación, Evaluación). Incluye búsqueda en vivo y filtros rápidos.</p>
                      <span className="font-extrabold text-slate-700 dark:text-slate-300 mt-2">📝 Editor en Pantalla Dividida</span>
                      <p>Edita el contenido en el panel izquierdo y observa en tiempo real la renderización formal en formato de hoja corporativa física a la derecha.</p>
                    </div>
                    <div className="w-1/2 flex flex-col gap-1.5 pl-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-extrabold text-slate-700 dark:text-slate-300">🔍 Inspector de Metadatos</span>
                      <p>Observa la cláusula exacta de la norma vinculada (§4.1, §6.1.2), la versión, y los Objetivos de Desarrollo Sostenible (ODS) de la ONU impactados.</p>
                      <span className="font-extrabold text-slate-700 dark:text-slate-300 mt-2">✍️ Flujo de Aprobación Realista</span>
                      <p>Somete el documento a revisión. Observa la línea de firmas interactivas (Borrador ➔ En Revisión ➔ Firma del CEO) para habilitar la auditoría.</p>
                    </div>
                  </div>
                </div>
              )}

              {welcomeStep === 3 && (
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">
                      Selecciona la Empresa a Administrar
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Cada industria posee presupuestos, aspectos ambientales y leyes regulatorias específicas
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {/* Metal */}
                    <button 
                      onClick={() => { switchCompany('metal'); setShowWelcome(false); }}
                      className="text-left border border-slate-200 dark:border-slate-850 hover:border-emerald-500/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/10 cursor-pointer transition-all flex flex-col justify-between group text-slate-800 dark:text-slate-100"
                    >
                      <div>
                        <span className="text-xl">⚙️</span>
                        <h4 className="text-xs font-black group-hover:text-emerald-500 transition-colors mt-2">
                          Metalmecánica
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          EnviroPro S.A. Control de ruido perimetral, reciclaje de scrap y Scope 2.
                        </p>
                      </div>
                      <span className="text-[9px] text-emerald-500 font-black uppercase tracking-wider mt-4 flex items-center gap-1">
                        Elegir <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>

                    {/* Chem */}
                    <button 
                      onClick={() => { switchCompany('chem'); setShowWelcome(false); }}
                      className="text-left border border-slate-200 dark:border-slate-850 hover:border-purple-500/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-purple-50/10 dark:hover:bg-purple-950/10 cursor-pointer transition-all flex flex-col justify-between group text-slate-800 dark:text-slate-100"
                    >
                      <div>
                        <span className="text-xl">🧪</span>
                        <h4 className="text-xs font-black group-hover:text-purple-500 transition-colors mt-2">
                          Agroquímica
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          BioChem S.A. Manejo de insumos HAZMAT, efluentes ácidos y control de gases COVs.
                        </p>
                      </div>
                      <span className="text-[9px] text-purple-500 font-black uppercase tracking-wider mt-4 flex items-center gap-1">
                        Elegir <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>

                    {/* Power */}
                    <button 
                      onClick={() => { switchCompany('power'); setShowWelcome(false); }}
                      className="text-left border border-slate-200 dark:border-slate-850 hover:border-sky-500/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-sky-50/10 dark:hover:bg-sky-950/10 cursor-pointer transition-all flex flex-col justify-between group text-slate-800 dark:text-slate-100"
                    >
                      <div>
                        <span className="text-xl">⚡</span>
                        <h4 className="text-xs font-black group-hover:text-sky-500 transition-colors mt-2">
                          EcoPower Refinería
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          Refinería biodiésel. Trazabilidad de soya, cero descargas hídricas ZLD.
                        </p>
                      </div>
                      <span className="text-[9px] text-sky-500 font-black uppercase tracking-wider mt-4 flex items-center gap-1">
                        Elegir <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>

                    {/* Mine */}
                    <button 
                      onClick={() => { switchCompany('mine'); setShowWelcome(false); }}
                      className="text-left border border-slate-200 dark:border-slate-850 hover:border-amber-500/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-amber-50/10 dark:hover:bg-amber-950/10 cursor-pointer transition-all flex flex-col justify-between group text-slate-800 dark:text-slate-100"
                    >
                      <div>
                        <span className="text-xl">🏆</span>
                        <h4 className="text-xs font-black group-hover:text-amber-500 transition-colors mt-2">
                          Minería de Oro
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          MineGold S.A. Gestión de cianuro, presas de relaves y licencia comunitaria social.
                        </p>
                      </div>
                      <span className="text-[9px] text-amber-500 font-black uppercase tracking-wider mt-4 flex items-center gap-1">
                        Elegir <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>

                    {/* Oil */}
                    <button 
                      onClick={() => { switchCompany('oil'); setShowWelcome(false); }}
                      className="text-left border border-slate-200 dark:border-slate-850 hover:border-orange-500/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-orange-50/10 dark:hover:bg-orange-950/10 cursor-pointer transition-all flex flex-col justify-between group text-slate-800 dark:text-slate-100"
                    >
                      <div>
                        <span className="text-xl">🛢️</span>
                        <h4 className="text-xs font-black group-hover:text-orange-500 transition-colors mt-2">
                          Petróleo & Gas
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          PetroGlow S.A. Fugas en oleoductos SCADA, flare gas y remediación de suelos.
                        </p>
                      </div>
                      <span className="text-[9px] text-orange-500 font-black uppercase tracking-wider mt-4 flex items-center gap-1">
                        Elegir <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>

                    {/* Airport */}
                    <button 
                      onClick={() => { switchCompany('airport'); setShowWelcome(false); }}
                      className="text-left border border-slate-200 dark:border-slate-850 hover:border-indigo-500/50 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 cursor-pointer transition-all flex flex-col justify-between group text-slate-800 dark:text-slate-100"
                    >
                      <div>
                        <span className="text-xl">✈️</span>
                        <h4 className="text-xs font-black group-hover:text-indigo-500 transition-colors mt-2">
                          Aeropuerto
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-normal mt-1">
                          SkyGate Airport. Ruido de aeronaves, de-icing fluid y Scope 3 de aerolíneas.
                        </p>
                      </div>
                      <span className="text-[9px] text-indigo-500 font-black uppercase tracking-wider mt-4 flex items-center gap-1">
                        Elegir <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Navigation Buttons */}
            <div className="border-t border-slate-100 dark:border-slate-850 px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">
                Paso {welcomeStep + 1} de 4
              </span>
              <div className="flex gap-2.5">
                {welcomeStep > 0 && (
                  <button 
                    onClick={() => setWelcomeStep(welcomeStep - 1)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Atrás
                  </button>
                )}
                {welcomeStep < 3 ? (
                  <button 
                    onClick={() => setWelcomeStep(welcomeStep + 1)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => { setShowWelcome(false); }}
                    className="px-4 py-2 bg-slate-850 dark:bg-slate-100 text-white dark:text-slate-850 text-xs font-bold rounded-xl cursor-pointer transition-all"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      <InteractiveTour open={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
}
