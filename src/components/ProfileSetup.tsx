'use client';

import React, { useState } from 'react';
import { ChevronRight, UserRound, X, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import {
  avatarClasses,
  experienceLabels,
  roleLabels,
  useProfileStore,
  type AvatarTone,
  type PlayerProfile,
  type ProfileExperience,
  type ProfileRole,
} from '@/store/profileStore';

interface ProfileSetupProps {
  initial?: PlayerProfile | null;
  onSaved: () => void;
  onClose?: () => void;
}

const avatarOptions: AvatarTone[] = ['leaf', 'lime', 'coral', 'sky', 'amber'];
const avatarNames: Record<AvatarTone, string> = {
  leaf: 'Verde bosque',
  lime: 'Lima',
  coral: 'Coral',
  sky: 'Cielo',
  amber: 'Ámbar',
};

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfileSetup({ initial, onSaved, onClose }: ProfileSetupProps) {
  const saveProfile = useProfileStore((state) => state.saveProfile);
  const [name, setName] = useState(initial?.name ?? '');
  const [role, setRole] = useState<ProfileRole | ''>(initial?.role ?? '');
  const [experience, setExperience] = useState<ProfileExperience>(initial?.experience ?? 'beginner');
  const [avatar, setAvatar] = useState<AvatarTone>(initial?.avatar ?? 'lime');

  const canSave = name.trim().length > 0 && role !== '';

  const handleSave = () => {
    if (!canSave) return;
    saveProfile({ name: name.trim(), role, experience, avatar });
    onSaved();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-setup-title"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-emerald-950/90 px-4 py-8 backdrop-blur-sm"
    >
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-200/20 bg-[#f7f8ee] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-emerald-900 p-8 text-white md:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-lime-400/80" aria-hidden="true" />
          <div className="absolute bottom-12 right-10 h-7 w-7 rotate-45 bg-lime-400" aria-hidden="true" />
          <Logo className="relative" />
          <div className="relative mt-auto pt-16">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-lime-300">Learning Lab 02</p>
            <h1 className="mt-4 max-w-md text-balance text-4xl font-black leading-[0.98] tracking-tight md:text-5xl">
              Conviértete en arquitecto ambiental.
            </h1>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-6 text-emerald-100">
              Aprende ISO 14001:2026 tomando decisiones reales, gestionando riesgos y llevando una organización hasta la certificación.
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-center p-8 md:p-12">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar edición de perfil"
              className="absolute right-5 top-5 rounded-xl p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="mb-6 flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black ${avatarClasses[avatar]}`} aria-hidden="true">
              {name.trim() ? getInitials(name) : <UserRound className="h-6 w-6" />}
            </div>
            <div>
              <h2 id="profile-setup-title" className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-800">
                {initial ? 'Editar perfil' : 'Crea tu perfil de misión'}
              </h2>
              <p className="text-sm text-slate-600">Tu progreso, rango y logros quedan asociados a este perfil.</p>
            </div>
          </div>

          <label className="text-xs font-black uppercase tracking-wider text-slate-700" htmlFor="player-name">
            ¿Cómo te llamamos?
          </label>
          <input
            id="player-name"
            value={name}
            maxLength={40}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre o alias"
            className="mt-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-700"
          />

          <label className="mt-5 text-xs font-black uppercase tracking-wider text-slate-700" htmlFor="player-role">
            Tu rol profesional
          </label>
          <select
            id="player-role"
            value={role}
            onChange={(event) => setRole(event.target.value as ProfileRole | '')}
            className="mt-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-700"
          >
            <option value="">Selecciona una opción</option>
            {(Object.keys(roleLabels) as ProfileRole[]).map((key) => (
              <option key={key} value={key}>
                {roleLabels[key]}
              </option>
            ))}
          </select>

          <fieldset className="mt-5">
            <legend className="text-xs font-black uppercase tracking-wider text-slate-700">Tu experiencia con la norma</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {(Object.keys(experienceLabels) as ProfileExperience[]).map((key) => {
                const active = experience === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setExperience(key)}
                    className={`rounded-2xl border-2 px-3 py-2.5 text-left text-xs font-bold leading-snug transition ${
                      active
                        ? 'border-emerald-700 bg-emerald-800 text-white'
                        : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-600'
                    }`}
                  >
                    {experienceLabels[key]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-xs font-black uppercase tracking-wider text-slate-700">Color de avatar</legend>
            <div className="mt-2 flex gap-2.5">
              {avatarOptions.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  aria-label={avatarNames[tone]}
                  aria-pressed={avatar === tone}
                  onClick={() => setAvatar(tone)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${avatarClasses[tone]} ${
                    avatar === tone ? 'ring-2 ring-emerald-900 ring-offset-2 ring-offset-[#f7f8ee]' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {avatar === tone && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-5 py-4 text-sm font-black text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            {initial ? 'Guardar cambios' : 'Entrar al laboratorio'} <ChevronRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
            Solo se guarda en este navegador. No necesitas una cuenta para jugar.
          </p>
        </div>
      </div>
    </div>
  );
}
