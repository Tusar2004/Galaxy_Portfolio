// src/stores/vehicleCustomizationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VehicleCustomization {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  trailColor: string;
  glowColor: string;
  decal: string;
  trailIntensity: number;
  glowIntensity: number;
  preset: string;
}

interface CustomizationState {
  rocket: VehicleCustomization;
  car: VehicleCustomization;
  astronaut: VehicleCustomization;
  
  currentVehicle: "rocket" | "car" | "astronaut";
  showCustomizer: boolean;
  
  setCustomization: (vehicle: "rocket" | "car" | "astronaut", customization: Partial<VehicleCustomization>) => void;
  setCurrentVehicle: (vehicle: "rocket" | "car" | "astronaut") => void;
  toggleCustomizer: () => void;
  applyPreset: (vehicle: "rocket" | "car" | "astronaut", preset: string) => void;
  resetCustomization: (vehicle: "rocket" | "car" | "astronaut") => void;
}

const defaultRocketCustomization: VehicleCustomization = {
  primaryColor: "#0b0f14",
  secondaryColor: "#0ea5e9",
  accentColor: "#00d4ff",
  trailColor: "#00e4ff",
  glowColor: "#00d4ff",
  decal: "none",
  trailIntensity: 1,
  glowIntensity: 1,
  preset: "default",
};

const defaultCarCustomization: VehicleCustomization = {
  primaryColor: "#1a1a1a",
  secondaryColor: "#0ea5e9",
  accentColor: "#00d4ff",
  trailColor: "#00e4ff",
  glowColor: "#00d4ff",
  decal: "none",
  trailIntensity: 1,
  glowIntensity: 1,
  preset: "default",
};

const defaultAstronautCustomization: VehicleCustomization = {
  primaryColor: "#ffffff",
  secondaryColor: "#1a3a4a",
  accentColor: "#0ea5e9",
  trailColor: "#00d4ff",
  glowColor: "#00ffff",
  decal: "none",
  trailIntensity: 0.5,
  glowIntensity: 0.8,
  preset: "default",
};

const PRESETS: Record<string, Partial<VehicleCustomization>> = {
  default: {},
  cyberpunk: {
    primaryColor: "#ff006e",
    secondaryColor: "#8b5cf6",
    accentColor: "#00d4ff",
    trailColor: "#ff006e",
    glowColor: "#ff00ff",
    preset: "cyberpunk",
  },
  stealth: {
    primaryColor: "#0a0a0a",
    secondaryColor: "#1a1a1a",
    accentColor: "#2a2a2a",
    trailColor: "#333333",
    glowColor: "#444444",
    preset: "stealth",
  },
  neon: {
    primaryColor: "#000000",
    secondaryColor: "#00ff99",
    accentColor: "#00ffff",
    trailColor: "#00ff99",
    glowColor: "#00ffff",
    preset: "neon",
  },
  sunset: {
    primaryColor: "#ff6b35",
    secondaryColor: "#f7931e",
    accentColor: "#ffd700",
    trailColor: "#ff8c42",
    glowColor: "#ffa500",
    preset: "sunset",
  },
  ocean: {
    primaryColor: "#006494",
    secondaryColor: "#0496ff",
    accentColor: "#00d4ff",
    trailColor: "#06b6d4",
    glowColor: "#00d4ff",
    preset: "ocean",
  },
  forest: {
    primaryColor: "#2d5016",
    secondaryColor: "#52b788",
    accentColor: "#95d5b2",
    trailColor: "#74c69d",
    glowColor: "#52b788",
    preset: "forest",
  },
  royal: {
    primaryColor: "#4a148c",
    secondaryColor: "#7b1fa2",
    accentColor: "#ce93d8",
    trailColor: "#9c27b0",
    glowColor: "#ba68c8",
    preset: "royal",
  },
  fire: {
    primaryColor: "#c1121f",
    secondaryColor: "#ff6700",
    accentColor: "#ffd60a",
    trailColor: "#ff9500",
    glowColor: "#ff4800",
    preset: "fire",
  },
};

export const useVehicleCustomizationStore = create<CustomizationState>()(
  persist(
    (set, get) => ({
      rocket: defaultRocketCustomization,
      car: defaultCarCustomization,
      astronaut: defaultAstronautCustomization,
      currentVehicle: "rocket",
      showCustomizer: false,

      setCustomization: (vehicle, customization) => {
        set((state) => ({
          [vehicle]: {
            ...state[vehicle],
            ...customization,
          },
        }));
        
        window.dispatchEvent(new CustomEvent("vehicle-customized"));
      },

      setCurrentVehicle: (vehicle) => set({ currentVehicle: vehicle }),

      toggleCustomizer: () => set((state) => ({ showCustomizer: !state.showCustomizer })),

      applyPreset: (vehicle, preset) => {
        const presetData = PRESETS[preset];
        if (!presetData) return;
        
        get().setCustomization(vehicle, presetData);
      },

      resetCustomization: (vehicle) => {
        const defaults = {
          rocket: defaultRocketCustomization,
          car: defaultCarCustomization,
          astronaut: defaultAstronautCustomization,
        };
        
        set({ [vehicle]: defaults[vehicle] });
      },
    }),
    {
      name: "vehicle-customization",
      version: 1,
    }
  )
);