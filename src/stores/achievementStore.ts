// src/stores/achievementStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "exploration" | "speed" | "interaction" | "secret";
  progress: number;
  maxProgress: number;
}

interface AchievementState {
  achievements: Achievement[];
  totalProgress: number;
  recentUnlock: Achievement | null;
  
  // Actions
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  clearRecentUnlock: () => void;
  resetAchievements: () => void;
}

const initialAchievements: Achievement[] = [
  // Exploration Achievements
  {
    id: "first_launch",
    title: "First Launch",
    description: "Start your journey into the portfolio galaxy",
    icon: "🚀",
    unlocked: false,
    rarity: "common",
    category: "exploration",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "planet_explorer",
    title: "Planet Explorer",
    description: "Visit your first planet",
    icon: "🌍",
    unlocked: false,
    rarity: "common",
    category: "exploration",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "galaxy_traveler",
    title: "Galaxy Traveler",
    description: "Visit all 5 planets",
    icon: "🌌",
    unlocked: false,
    rarity: "rare",
    category: "exploration",
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "deep_diver",
    title: "Deep Diver",
    description: "Spend 5 minutes exploring interiors",
    icon: "⏱️",
    unlocked: false,
    rarity: "rare",
    category: "exploration",
    progress: 0,
    maxProgress: 300, // 300 seconds
  },
  
  // Speed Achievements
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Use boost 50 times",
    icon: "⚡",
    unlocked: false,
    rarity: "common",
    category: "speed",
    progress: 0,
    maxProgress: 50,
  },
  {
    id: "sonic_boom",
    title: "Sonic Boom",
    description: "Travel at max speed for 30 seconds",
    icon: "💨",
    unlocked: false,
    rarity: "rare",
    category: "speed",
    progress: 0,
    maxProgress: 30,
  },
  {
    id: "marathon_runner",
    title: "Marathon Runner",
    description: "Travel a total distance of 1000 units",
    icon: "🏃",
    unlocked: false,
    rarity: "epic",
    category: "speed",
    progress: 0,
    maxProgress: 1000,
  },
  
  // Interaction Achievements
  {
    id: "vehicle_switcher",
    title: "Vehicle Switcher",
    description: "Try all 3 vehicle modes",
    icon: "🔄",
    unlocked: false,
    rarity: "common",
    category: "interaction",
    progress: 0,
    maxProgress: 3,
  },
  {
    id: "photographer",
    title: "Photographer",
    description: "Take your first photo",
    icon: "📸",
    unlocked: false,
    rarity: "common",
    category: "interaction",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "influencer",
    title: "Influencer",
    description: "Take 10 photos",
    icon: "🌟",
    unlocked: false,
    rarity: "rare",
    category: "interaction",
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "customizer",
    title: "Customizer",
    description: "Customize your vehicle",
    icon: "🎨",
    unlocked: false,
    rarity: "common",
    category: "interaction",
    progress: 0,
    maxProgress: 1,
  },
  
  // Secret Achievements
  {
    id: "secret_planet",
    title: "???",
    description: "Find the hidden planet",
    icon: "❓",
    unlocked: false,
    rarity: "legendary",
    category: "secret",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "easter_egg_hunter",
    title: "Easter Egg Hunter",
    description: "Discover all hidden secrets",
    icon: "🥚",
    unlocked: false,
    rarity: "epic",
    category: "secret",
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Visit the portfolio at night",
    icon: "🦉",
    unlocked: false,
    rarity: "rare",
    category: "secret",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "konami_master",
    title: "Konami Master",
    description: "Enter the legendary code",
    icon: "🎮",
    unlocked: false,
    rarity: "legendary",
    category: "secret",
    progress: 0,
    maxProgress: 1,
  },
];

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: initialAchievements,
      totalProgress: 0,
      recentUnlock: null,

      unlockAchievement: (id: string) => {
        const achievements = get().achievements;
        const achievement = achievements.find((a) => a.id === id);
        
        if (!achievement || achievement.unlocked) return;

        const updatedAchievements = achievements.map((a) =>
          a.id === id
            ? {
                ...a,
                unlocked: true,
                unlockedAt: new Date(),
                progress: a.maxProgress,
              }
            : a
        );

        const unlockedCount = updatedAchievements.filter((a) => a.unlocked).length;
        const totalProgress = (unlockedCount / updatedAchievements.length) * 100;

        set({
          achievements: updatedAchievements,
          totalProgress: Math.round(totalProgress),
          recentUnlock: { ...achievement, unlocked: true, unlockedAt: new Date() },
        });

        // Auto-clear recent unlock after 5 seconds
        setTimeout(() => {
          get().clearRecentUnlock();
        }, 5000);

        // Play unlock sound
        try {
          const audio = new Audio("/achievement-unlock.mp3");
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (e) {}
      },

      updateProgress: (id: string, progress: number) => {
        const achievements = get().achievements;
        const achievement = achievements.find((a) => a.id === id);
        
        if (!achievement || achievement.unlocked) return;

        const updatedAchievements = achievements.map((a) =>
          a.id === id ? { ...a, progress: Math.min(progress, a.maxProgress) } : a
        );

        set({ achievements: updatedAchievements });

        // Auto-unlock if progress reaches max
        if (progress >= achievement.maxProgress) {
          get().unlockAchievement(id);
        }
      },

      clearRecentUnlock: () => set({ recentUnlock: null }),

      resetAchievements: () =>
        set({
          achievements: initialAchievements,
          totalProgress: 0,
          recentUnlock: null,
        }),
    }),
    {
      name: "portfolio-achievements",
      version: 1,
    }
  )
);