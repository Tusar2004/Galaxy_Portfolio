// src/stores/photoModeStore.ts
import { create } from "zustand";

interface PhotoModeState {
  isPhotoMode: boolean;
  isPaused: boolean;
  currentFilter: string;
  photos: CapturedPhoto[];
  
  // Actions
  togglePhotoMode: () => void;
  setFilter: (filter: string) => void;
  capturePhoto: (imageData: string) => void;
  deletePhoto: (id: string) => void;
  clearPhotos: () => void;
}

export interface CapturedPhoto {
  id: string;
  imageData: string;
  timestamp: Date;
  filter: string;
  location?: string;
}

export const usePhotoModeStore = create<PhotoModeState>((set, get) => ({
  isPhotoMode: false,
  isPaused: false,
  currentFilter: "none",
  photos: [],

  togglePhotoMode: () => {
    const newState = !get().isPhotoMode;
    set({ isPhotoMode: newState, isPaused: newState });
    
    // Dispatch event for camera control
    window.dispatchEvent(
      new CustomEvent("photo-mode-toggle", { detail: { active: newState } })
    );
  },

  setFilter: (filter: string) => set({ currentFilter: filter }),

  capturePhoto: (imageData: string) => {
    const photo: CapturedPhoto = {
      id: `photo_${Date.now()}`,
      imageData,
      timestamp: new Date(),
      filter: get().currentFilter,
    };
    
    set((state) => ({
      photos: [...state.photos, photo],
    }));

    // Play shutter sound
    try {
      const audio = new Audio("/camera-shutter.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}

    // Flash effect
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: fixed;
      inset: 0;
      background: white;
      z-index: 99999;
      pointer-events: none;
      animation: flashEffect 0.3s ease-out;
    `;
    document.body.appendChild(flash);
    
    const style = document.createElement("style");
    style.textContent = `
      @keyframes flashEffect {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      document.body.removeChild(flash);
      document.head.removeChild(style);
    }, 300);
  },

  deletePhoto: (id: string) =>
    set((state) => ({
      photos: state.photos.filter((p) => p.id !== id),
    })),

  clearPhotos: () => set({ photos: [] }),
}));