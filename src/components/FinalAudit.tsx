'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Award, ArrowRight, BadgeCheck, CheckCircle2, CircleAlert, ClipboardList, FileSearch,
  Factory, Loader2, RefreshCw, ShieldAlert, Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/gameStore';
import { useProfileStore } from '@/store/profileStore';
import {
  getAuditRequirements, getReadinessScore, isAuditReady,
  type AuditRequirement, type GameTab,
} from '@/lib/auditRequirements';

interface FinalAuditProps {
  onNavigate?: (tab: GameTab) => void;
}

const companyIdentity: Record<string, { name: string; legal: string; specialty: string }> = {
  metal: { name: 'EnviroPro', legal: 'ENVIROPRO METALMECÁNICA S.A.', specialty: 'Manufactura metalmecánica de piezas de alta precisión y montaje de componentes de distribución.' },
  chem: { name: 'BioChem', legal: 'BIOCHEM AGROQUÍMICA S.A.', specialty: 'Formulación y envasado de soluciones de agroquímicos y plaguicidas de alto desempeño.' },
  power: { name: 'EcoPower', legal: 'ECOPOWER REFINERÍA S.A.', specialty: 'Refinación de biodiésel y biocombustibles a granel con criterios de descarbonización.' },
  mine: { name: 'MineGold', legal: 'MINEGOLD AURUM VALLEY S.A.', specialty: 'Explotación de oro a tajo abierto con gestión de cianuro y estabilidad de relaveras.' },
  oil: { name: 'PetroGlow', legal: 'PETROGLOW OIL & GAS S.A.', specialty: 'Extracción onshore y refinamiento de crudo con control SCADA y biorremediación de suelos.' },
  airport: { name: 'SkyGate', legal: 'SKYGATE AIRPORT S.A.', specialty: 'Operación aeroportuaria internacional con control de ruido y descarbonización de rampa.' },
};

const auditSteps = [
  { label: 'Etapa 1 · Revisión documental', detail: 'El auditor revisa política, matrices y registros del SGA.' },
  { label: 'Etapa 2 · Verificación en planta', detail: 'Entrevistas, recorrido operativo y muestreo de evidencias.' },
  { label: 'Decisión del comité de certificación', detail: 'Se consolidan los hallazgos y se emite el dictamen.' },
];

function ReadinessRing({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const ready = value === 100;
  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center" role="img" aria-label={`Preparación para la auditoría: ${value}%`}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-800" />
        <circle
          cx="64" cy="64" r={radius} fill="none" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className={`transition-all duration-700 ${ready ? 'stroke-emerald-500' : value >= 50 ? 'stroke-amber-500' : 'stroke-rose-500'}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{value}%</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Preparación</span>
      </div>
    </div>
  );
}

function RequirementCard({ requirement, onNavigate }: { requirement: AuditRequirement; onNavigate?: (tab: GameTab) => void }) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border p-4 ${
        requirement.met
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-950/30'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <div className="flex items-start gap-3">
        {requirement.met ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Cumplido" />
        ) : (
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" aria-label="Pendiente" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
            <span className="mr-2 font-mono text-xs text-emerald-700 dark:text-emerald-400">§{requirement.clause}</span>
            {requirement.title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{requirement.detail}</p>
        </div>
        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-black uppercase ${
          requirement.severity === 'major'
            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
        }`}>
          {requirement.severity === 'major' ? 'Mayor' : 'Menor'}
        </span>
      </div>
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>{requirement.progressLabel}</span>
          <span>{requirement.progress}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" aria-valuenow={requirement.progress} aria-valuemin={0} aria-valuemax={100} aria-label={requirement.title}>
          <div className={`h-full rounded-full transition-all duration-500 ${requirement.met ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${requirement.progress}%` }} />
        </div>
      </div>
      {!requirement.met && onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate(requirement.tab)}
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white transition hover:bg-emerald-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-lime-300"
        >
          {requirement.action} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </article>
  );
}

export default function FinalAudit({ onNavigate }: FinalAuditProps) {
  const store = useGameStore();
  const {
    currentCompanyId, certificationStatus, runFinalAudit, resetGame,
    legalCompliance, environmentalScore, reputation, awarenessScore,
  } = store;
  const profile = useProfileStore((state) => state.profile);

  const [auditing, setAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const requirements = getAuditRequirements(store);
  const readiness = getReadinessScore(requirements);
  const ready = isAuditReady(requirements);
  const unmet = requirements.filter((r) => !r.met);
  const majors = unmet.filter((r) => r.severity === 'major');
  const identity = companyIdentity[currentCompanyId] ?? companyIdentity.metal;
  const certCode = `${currentCompanyId.toUpperCase()}-${String(currentCompanyId.length * 137 + 2401).padStart(6, '0')}`;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (certificationStatus !== 'certified') return;
    const duration = 4000;
    const end = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const interval = setInterval(() => {
      const left = end - Date.now();
      if (left <= 0) return clearInterval(interval);
      const count = 40 * (left / duration);
      confetti({ ...defaults, particleCount: count, origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount: count, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 } });
    }, 250);
    return () => clearInterval(interval);
  }, [certificationStatus]);

  const startAudit = () => {
    if (!ready || auditing) return;
    setAuditing(true);
    setAuditStep(0);
    timers.current.push(setTimeout(() => setAuditStep(1), 1400));
    timers.current.push(setTimeout(() => setAuditStep(2), 2800));
    timers.current.push(setTimeout(() => {
      runFinalAudit();
      setAuditing(false);
    }, 4200));
  };

  const maturity = (() => {
    const score = (environmentalScore + legalCompliance + reputation) / 3;
    if (score >= 90) return { level: 'Nivel 5: Sostenibilidad optimizada', desc: 'El SGA está integrado en la estrategia del negocio y la descarbonización es proactiva.' };
    if (score >= 75) return { level: 'Nivel 4: Gestión avanzada y cuantificada', desc: 'Control operacional maduro y reducción medible del impacto ambiental.' };
    if (score >= 60) return { level: 'Nivel 3: Sistema conforme y documentado', desc: 'Cumplimiento legal garantizado y SGA conforme a ISO 14001.' };
    return { level: 'Nivel 2: Inicial o reactivo', desc: 'Reacciones ante incidentes y brechas legales frecuentes.' };
  })();

  if (auditing) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900" role="status" aria-live="polite">
        <div className="flex items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-600 dark:text-emerald-400" />
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Auditoría de certificación en curso</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300">El organismo certificador está evaluando {identity.name}.</p>
          </div>
        </div>
        <ol className="flex flex-col gap-3">
          {auditSteps.map((step, index) => {
            const done = index < auditStep;
            const current = index === auditStep;
            return (
              <li
                key={step.label}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                  done ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-950/30'
                    : current ? 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-950/30'
                      : 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-950/50'
                }`}
              >
                {done ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  : current ? <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-amber-600 dark:text-amber-400" />
                    : <ClipboardList className="mt-0.5 h-5 w-5 text-slate-500 dark:text-slate-400" />}
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">{step.label}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {certificationStatus === 'preparing' && (
        <>
          <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:p-8">
            <ReadinessRing value={readiness} />
            <div className="flex-1">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">ISO 14001:2026 · Certificación</p>
              <h2 className="mt-1 text-balance text-2xl font-black text-slate-900 dark:text-white">
                {ready ? 'Tu organización está lista para auditarse' : 'Aún no estás listo para solicitar la auditoría'}
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {ready
                  ? 'Cumples los 8 requisitos evaluados. Al iniciar, el organismo certificador revisará la documentación y verificará la operación en planta.'
                  : `Faltan ${unmet.length} requisito(s), de los cuales ${majors.length} generarían una no conformidad mayor y suspenderían la certificación.`}
              </p>
              <button
                type="button"
                onClick={startAudit}
                disabled={!ready}
                className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition ${
                  ready
                    ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-0.5 hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {ready ? 'Iniciar auditoría final de certificación' : 'Completa los requisitos para auditarte'}
              </button>
            </div>
          </section>

          <section aria-label="Etapas de la auditoría" className="grid gap-3 md:grid-cols-2">
            {([
              { stage: 'documental', title: 'Etapa 1 · Revisión documental', icon: FileSearch },
              { stage: 'operational', title: 'Etapa 2 · Verificación en planta', icon: Factory },
            ] as const).map(({ stage, title, icon: Icon }) => {
              const items = requirements.filter((r) => r.stage === stage);
              const passed = items.filter((r) => r.met).length;
              const ok = passed === items.length;
              return (
                <div key={stage} className={`flex items-center gap-3 rounded-2xl border p-4 ${ok ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${ok ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100">{title}</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{passed} de {items.length} requisitos superados</p>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="grid gap-3 md:grid-cols-2" aria-label="Requisitos de certificación">
            {requirements.map((requirement) => (
              <RequirementCard key={requirement.id} requirement={requirement} onNavigate={onNavigate} />
            ))}
          </section>
        </>
      )}

      {certificationStatus === 'failed' && (
        <section className="flex flex-col gap-5 rounded-3xl border border-rose-300 bg-white p-6 dark:border-rose-500/40 dark:bg-slate-900 md:p-8">
          <div className="flex items-start gap-3.5">
            <ShieldAlert className="h-9 w-9 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Auditoría desaprobada: certificación rechazada</h2>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                El organismo certificador registró {unmet.length} hallazgo(s). Corrige cada uno y solicita una nueva auditoría.
              </p>
            </div>
          </div>
          {unmet.length === 0 ? (
            <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              Todos los requisitos ya se cumplen ahora. Puedes reintentar la auditoría.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {unmet.map((requirement) => (
                <li key={requirement.id} className="flex flex-col gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-950/30 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <strong className="text-rose-800 dark:text-rose-300">
                      No conformidad {requirement.severity === 'major' ? 'mayor' : 'menor'} · Cláusula {requirement.clause}:
                    </strong>{' '}
                    {requirement.finding}
                  </p>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate(requirement.tab)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white transition hover:bg-emerald-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-lime-300"
                    >
                      {requirement.action} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => useGameStore.setState({ certificationStatus: 'preparing' })}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <RefreshCw className="h-4 w-4" /> Volver a preparar la auditoría
          </button>
        </section>
      )}

      {certificationStatus === 'certified' && (
        <div className="flex flex-col gap-6">
          <section className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl border-4 border-double border-emerald-500 bg-white p-8 text-center shadow-xl dark:bg-slate-900">
            <div className="flex w-full items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="text-left">
                <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{identity.name}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Sistemas ambientales</p>
              </div>
              <span className="flex items-center gap-1 rounded bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <BadgeCheck className="h-4 w-4" /> Certificado oficial
              </span>
            </div>
            <Award className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
            <h1 className="font-serif text-3xl font-black uppercase tracking-wide text-slate-900 dark:text-white">Certificado de conformidad</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Se otorga el presente reconocimiento a</p>
            <p className="border-b-2 border-emerald-500/40 px-6 pb-1 text-xl font-black text-slate-900 dark:text-white">{identity.legal}</p>
            <p className="max-w-lg text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Por haber implementado, mantenido y mejorado su Sistema de Gestión Ambiental conforme a la norma internacional:
            </p>
            <p className="rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-2 text-sm font-black text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300">
              ISO 14001:2026 (4ª edición)
            </p>
            <p className="max-w-sm text-xs text-slate-700 dark:text-slate-300">Alcance: {identity.specialty}</p>
            <div className="mt-4 grid w-full grid-cols-2 gap-8 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-36 items-end justify-center border-b border-slate-400 font-serif text-sm italic text-slate-800 dark:border-slate-600 dark:text-slate-200">Lead Auditor IA</div>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Auditor líder</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-36 items-end justify-center border-b border-slate-400 font-serif text-sm italic text-slate-800 dark:border-slate-600 dark:text-slate-200">
                  {profile?.name ?? 'Responsable del SGA'}
                </div>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Responsable del SGA</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Emisión: {new Date().toISOString().split('T')[0]} · Código CERT-ISO-14001-{certCode}
            </p>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-slate-100">
              <Trophy className="h-5 w-5 text-amber-500" /> Reporte de logros y desempeño
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Nivel de madurez</p>
                <p className="mt-0.5 text-base font-black text-slate-900 dark:text-white">{maturity.level}</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{maturity.desc}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <p className="text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Parámetros finales</p>
                <dl className="mt-2 flex flex-col gap-1.5 text-sm">
                  {[
                    ['Reputación corporativa', reputation],
                    ['Cumplimiento regulatorio', legalCompliance],
                    ['Capacitación y conciencia', awarenessScore],
                    ['Score ambiental', environmentalScore],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-slate-700 dark:text-slate-300">{label}</dt>
                      <dd className="font-black text-emerald-700 dark:text-emerald-400">{value}%</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="rounded-xl bg-emerald-800 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
                >
                  Ver mi perfil
                </button>
              )}
              <button
                type="button"
                onClick={resetGame}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-black text-slate-800 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Jugar de nuevo
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
