'use client';

import React from 'react';
import {
  Award, CheckCircle2, CircleDashed, ClipboardCheck, Layers, Lock, PenLine,
  Scale, ShieldCheck, Sun, Trophy, Pencil, ArrowRight, Building2,
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import {
  avatarClasses, experienceLabels, roleLabels, useProfileStore,
} from '@/store/profileStore';
import { getAuditRequirements, getReadinessScore, type GameTab } from '@/lib/auditRequirements';
import { getInitials } from '@/components/ProfileSetup';

interface ProfileViewProps {
  onEdit: () => void;
  onNavigate: (tab: GameTab) => void;
}

const badgeCatalog: Record<string, { label: string; desc: string; icon: React.ComponentType<{ className?: string }> }> = {
  policy_approved: { label: 'Líder Verde', desc: 'Política ambiental firmada por el CEO.', icon: PenLine },
  aspects_mapped: { label: 'Gestor de Cambios', desc: 'Cláusula 6.3 completada y aspectos mapeados.', icon: Layers },
  legal_compliant: { label: 'Legalmente Apto', desc: 'Cumplimiento legal regulatorio al 100%.', icon: Scale },
  audit_ready: { label: 'Listo para Certificar', desc: 'Probabilidad de certificación mayor al 80%.', icon: ClipboardCheck },
  green_energy: { label: 'Cero Fósiles', desc: 'Transición a energías renovables y eficiencia LED.', icon: Sun },
  zero_spill: { label: 'Protector de Suelo', desc: 'Diques, geomembranas o cubetos implementados.', icon: ShieldCheck },
};

const rankTitles = ['Aprendiz Ambiental', 'Analista de SGA', 'Coordinador EHS', 'Líder de Sistema', 'Maestro ISO 14001'];

const statusLabels: Record<string, string> = {
  not_started: 'Sin iniciar',
  preparing: 'En preparación',
  in_audit: 'En auditoría',
  certified: 'Certificada',
  failed: 'Auditoría fallida',
};

const nextStepByRole = {
  manager: 'Prioriza el mapa de planta: cada control que actives mueve el score ambiental y el riesgo operativo.',
  auditor: 'Entrena tu ojo de auditor: revisa la evidencia de cada cláusula antes de pedir la auditoría final.',
  student: 'Sigue las cláusulas 4 a 10 en orden; cada ejercicio explica el porqué del requisito.',
  leader: 'Equilibra presupuesto y riesgo: la certificación se gana con decisiones sostenibles, no con gasto.',
} as const;

export default function ProfileView({ onEdit, onNavigate }: ProfileViewProps) {
  const profile = useProfileStore((state) => state.profile);
  const store = useGameStore();
  const { xp, level, badges, companies, currentCompanyId, week, certificationStatus } = store;

  const requirements = getAuditRequirements(store);
  const readiness = getReadinessScore(requirements);
  const metCount = requirements.filter((requirement) => requirement.met).length;
  const nextPending = requirements.find((requirement) => !requirement.met);

  const xpNeeded = level * 1000;
  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));
  const rank = rankTitles[Math.min(level, rankTitles.length) - 1];
  const certifiedCount = Object.values(companies).filter((c) => c.certificationStatus === 'certified').length
    + (certificationStatus === 'certified' && companies[currentCompanyId].certificationStatus !== 'certified' ? 1 : 0);

  if (!profile) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Aún no tienes perfil</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Crea tu perfil para guardar tu rango, logros y progreso por empresa.</p>
        <button type="button" onClick={onEdit} className="rounded-2xl bg-emerald-800 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700">
          Crear perfil
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="relative overflow-hidden rounded-3xl bg-emerald-900 p-6 text-white md:p-8">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-lime-400/70" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl text-3xl font-black ${avatarClasses[profile.avatar]}`} aria-hidden="true">
            {getInitials(profile.name)}
          </div>
          <div className="flex-1">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-lime-300">Perfil de misión</p>
            <h1 className="mt-1 text-balance text-3xl font-black tracking-tight md:text-4xl">{profile.name}</h1>
            <p className="mt-1 text-sm text-emerald-100">
              {roleLabels[profile.role]} · {experienceLabels[profile.experience]}
            </p>
            <div className="mt-4 max-w-md">
              <div className="flex items-end justify-between text-xs font-bold text-emerald-100">
                <span>Nivel {level} · {rank}</span>
                <span>{xp} / {xpNeeded} XP</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-emerald-950/60" role="progressbar" aria-valuenow={xpPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso al siguiente nivel">
                <div className="h-full rounded-full bg-lime-300 transition-all duration-700" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-lime-300 px-4 py-2.5 text-xs font-black text-emerald-950 transition hover:bg-lime-200 md:self-center"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar perfil
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Semana de juego', value: `${week} / 52` },
          { label: 'Logros', value: `${badges.length} / ${Object.keys(badgeCatalog).length}` },
          { label: 'Requisitos de auditoría', value: `${metCount} / ${requirements.length}` },
          { label: 'Empresas certificadas', value: `${certifiedCount} / ${Object.keys(companies).length}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Ruta hacia la certificación</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {readiness}% listo
            </span>
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {requirements.map((requirement) => (
              <li key={requirement.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/50">
                {requirement.met ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Cumplido" />
                ) : (
                  <CircleDashed className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" aria-label="Pendiente" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                    <span className="mr-2 font-mono text-xs text-emerald-700 dark:text-emerald-400">§{requirement.clause}</span>
                    {requirement.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{requirement.progressLabel}</p>
                </div>
              </li>
            ))}
          </ul>
          {nextPending && (
            <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-950/30">
              <p className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">Siguiente paso recomendado</p>
              <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                Cláusula {nextPending.clause}: {nextPending.detail}
              </p>
              <button
                type="button"
                onClick={() => onNavigate(nextPending.tab)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-700"
              >
                {nextPending.action} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{nextStepByRole[profile.role]}</p>
        </section>

        <section className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              <Trophy className="h-4 w-4 text-amber-500" /> Logros
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {Object.entries(badgeCatalog).map(([key, badge]) => {
                const earned = badges.includes(key);
                const Icon = badge.icon;
                return (
                  <li
                    key={key}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                      earned
                        ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-950/40'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50'
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${earned ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {earned ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold ${earned ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{badge.label}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{badge.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Empresas
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {(Object.keys(companies) as Array<keyof typeof companies>).map((id) => {
                const isCurrent = id === currentCompanyId;
                const company = companies[id];
                const status = isCurrent ? certificationStatus : company.certificationStatus;
                const companyWeek = isCurrent ? week : company.week;
                return (
                  <li key={id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950/50">
                    <span className="min-w-0 truncate font-bold text-slate-900 dark:text-slate-100">
                      {company.name}
                      {isCurrent && <span className="ml-2 text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400">Actual</span>}
                    </span>
                    <span className={`shrink-0 text-xs font-bold ${status === 'certified' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {statusLabels[status] ?? status} · S{companyWeek}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        <Award className="h-3.5 w-3.5" /> Perfil creado el {new Date(profile.createdAt).toLocaleDateString('es-ES')}
      </p>
    </div>
  );
}
