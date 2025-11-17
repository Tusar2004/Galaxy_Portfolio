// src/systems/easterEggSystem.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  icon: string;
  found: boolean;
  foundAt?: Date;
  hint: string;
  type: "konami" | "click" | "explore" | "time" | "sequence";
  rarity: "common" | "rare" | "legendary";
}

interface EasterEggState {
  eggs: EasterEgg[];
  secretPlanetUnlocked: boolean;
  konamiSequence: string[];
  clickCount: number;
  lastClickTime: number;
  
  // Actions
  foundEgg: (eggId: string) => void;
  unlockSecretPlanet: () => void;
  trackKonamiInput: (key: string) => void;
  trackClick: () => void;
  resetEggs: () => void;
}

const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];

const INITIAL_EGGS: EasterEgg[] = [
  {
    id: "konami_code",
    name: "The Legendary Code",
    description: "You entered the legendary Konami Code!",
    icon: "🎮",
    found: false,
    hint: "Try the most famous cheat code in gaming history",
    type: "konami",
    rarity: "legendary",
  },
  {
    id: "secret_planet",
    name: "Hidden Planet X",
    description: "You discovered the mysterious Planet X!",
    icon: "🌑",
    found: false,
    hint: "Look beyond the known planets...",
    type: "explore",
    rarity: "legendary",
  },
  {
    id: "triple_boost",
    name: "Speed Demon",
    description: "Hold boost for 10 seconds straight",
    icon: "⚡",
    found: false,
    hint: "Need for speed!",
    type: "sequence",
    rarity: "rare",
  },
  {
    id: "midnight_visitor",
    name: "Midnight Explorer",
    description: "Visit the portfolio at exactly midnight",
    icon: "🌙",
    found: false,
    hint: "When the clock strikes twelve...",
    type: "time",
    rarity: "rare",
  },
  {
    id: "spin_master",
    name: "Spin Master",
    description: "Do a 360° spin in any vehicle",
    icon: "🌀",
    found: false,
    hint: "Try spinning, that's a good trick!",
    type: "sequence",
    rarity: "common",
  },
  {
    id: "click_frenzy",
    name: "Click Frenzy",
    description: "Click on the sun 50 times",
    icon: "☀️",
    found: false,
    hint: "The sun has secrets...",
    type: "click",
    rarity: "common",
  },
  {
    id: "planet_visitor",
    name: "Universal Tourist",
    description: "Visit all planets in a single session",
    icon: "🗺️",
    found: false,
    hint: "Complete the grand tour",
    type: "explore",
    rarity: "rare",
  },
  {
    id: "photo_bomb",
    name: "Perfect Shot",
    description: "Take a photo while boosting near a planet",
    icon: "📸",
    found: false,
    hint: "Capture the perfect moment",
    type: "sequence",
    rarity: "rare",
  },
];

export const useEasterEggStore = create<EasterEggState>()(
  persist(
    (set, get) => ({
      eggs: INITIAL_EGGS,
      secretPlanetUnlocked: false,
      konamiSequence: [],
      clickCount: 0,
      lastClickTime: 0,

      foundEgg: (eggId: string) => {
        const eggs = get().eggs;
        const egg = eggs.find((e) => e.id === eggId);
        
        if (!egg || egg.found) return;

        const updatedEggs = eggs.map((e) =>
          e.id === eggId ? { ...e, found: true, foundAt: new Date() } : e
        );

        set({ eggs: updatedEggs });

        // Show notification
        window.dispatchEvent(
          new CustomEvent("easter-egg-found", { detail: { egg: { ...egg, found: true } } })
        );

        // Play sound
        try {
          const audio = new Audio("/easter-egg-found.mp3");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch (e) {}

        // Track achievement
        window.dispatchEvent(new CustomEvent("secret-found", { detail: { secretId: eggId } }));
      },

      unlockSecretPlanet: () => {
        set({ secretPlanetUnlocked: true });
        get().foundEgg("secret_planet");
      },

      trackKonamiInput: (key: string) => {
        const sequence = [...get().konamiSequence, key];
        
        // Keep only last 10 keys
        if (sequence.length > 10) {
          sequence.shift();
        }

        set({ konamiSequence: sequence });

        // Check if Konami code is complete
        if (sequence.length === 10) {
          const isMatch = sequence.every((k, i) => k === KONAMI_CODE[i]);
          
          if (isMatch) {
            get().foundEgg("konami_code");
            get().unlockSecretPlanet();
            set({ konamiSequence: [] });
          }
        }
      },

      trackClick: () => {
        const now = Date.now();
        const lastClick = get().lastClickTime;
        
        // Reset count if more than 2 seconds passed
        if (now - lastClick > 2000) {
          set({ clickCount: 1, lastClickTime: now });
        } else {
          const newCount = get().clickCount + 1;
          set({ clickCount: newCount, lastClickTime: now });
          
          // Check for click frenzy achievement
          if (newCount >= 50) {
            get().foundEgg("click_frenzy");
            set({ clickCount: 0 });
          }
        }
      },

      resetEggs: () =>
        set({
          eggs: INITIAL_EGGS,
          secretPlanetUnlocked: false,
          konamiSequence: [],
          clickCount: 0,
          lastClickTime: 0,
        }),
    }),
    {
      name: "easter-eggs",
      version: 1,
    }
  )
);

// Helper function to check midnight
export function checkMidnight() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  if (hour === 0 && minute === 0) {
    const store = useEasterEggStore.getState();
    store.foundEgg("midnight_visitor");
  }
}

// Initialize Konami code listener
export function initializeEasterEggListeners() {
  // Konami Code
  window.addEventListener("keydown", (e) => {
    const store = useEasterEggStore.getState();
    store.trackKonamiInput(e.code);
  });

  // Check midnight every minute
  setInterval(checkMidnight, 60000);
}