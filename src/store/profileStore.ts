import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ProfileRole = 'manager' | 'auditor' | 'student' | 'leader';
export type ProfileExperience = 'beginner' | 'intermediate' | 'advanced';
export type AvatarTone = 'leaf' | 'lime' | 'coral' | 'sky' | 'amber';

export interface PlayerProfile {
  name: string;
  role: ProfileRole;
  experience: ProfileExperience;
  avatar: AvatarTone;
  createdAt: string;
}

interface ProfileState {
  profile: PlayerProfile | null;
  hydrated: boolean;
  saveProfile: (profile: Omit<PlayerProfile, 'createdAt'>) => void;
  clearProfile: () => void;
  markHydrated: () => void;
}

export const roleLabels: Record<ProfileRole, string> = {
  manager: 'Manager ambiental',
  auditor: 'Auditor interno',
  student: 'Estudiante',
  leader: 'Líder de operaciones',
};

export const experienceLabels: Record<ProfileExperience, string> = {
  beginner: 'Primera vez con ISO 14001',
  intermediate: 'Conozco la norma',
  advanced: 'Implemento sistemas de gestión',
};

export const avatarClasses: Record<AvatarTone, string> = {
  leaf: 'bg-emerald-700 text-white',
  lime: 'bg-lime-300 text-emerald-950',
  coral: 'bg-orange-400 text-orange-950',
  sky: 'bg-sky-400 text-sky-950',
  amber: 'bg-amber-300 text-amber-950',
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      hydrated: false,
      saveProfile: (profile) =>
        set((state) => ({
          profile: { ...profile, createdAt: state.profile?.createdAt ?? new Date().toISOString() },
        })),
      clearProfile: () => set({ profile: null }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'green-owl-profile',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
      skipHydration: true,
    },
  ),
);
