// src/stores/musicSystemStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  category: "ambient" | "action" | "planet" | "menu";
  planet?: string;
  volume?: number;
}

interface MusicState {
  currentTrack: string | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  tracks: MusicTrack[];
  
  // Actions
  playTrack: (trackId: string) => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  stopMusic: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const DEFAULT_TRACKS: MusicTrack[] = [
  // Ambient Space Music
  {
    id: "space_ambient_1",
    name: "Cosmic Drift",
    url: "/music/space-ambient-1.mp3",
    category: "ambient",
    volume: 0.5,
  },
  {
    id: "space_ambient_2",
    name: "Stellar Voyage",
    url: "/music/space-ambient-2.mp3",
    category: "ambient",
    volume: 0.5,
  },
  
  // Action Music (for boost/fast movement)
  {
    id: "action_1",
    name: "Hyperdrive",
    url: "/music/action-1.mp3",
    category: "action",
    volume: 0.6,
  },
  
  // Planet-specific Music
  {
    id: "origin_station",
    name: "Origin Station Theme",
    url: "/music/origin-station.mp3",
    category: "planet",
    planet: "origin-station",
    volume: 0.5,
  },
  {
    id: "tech_nebula",
    name: "Tech Nebula Theme",
    url: "/music/tech-nebula.mp3",
    category: "planet",
    planet: "tech-nebula",
    volume: 0.5,
  },
  {
    id: "project_galaxy",
    name: "Project Galaxy Theme",
    url: "/music/project-galaxy.mp3",
    category: "planet",
    planet: "project-galaxy",
    volume: 0.5,
  },
  {
    id: "career_cosmos",
    name: "Career Cosmos Theme",
    url: "/music/career-cosmos.mp3",
    category: "planet",
    planet: "career-cosmos",
    volume: 0.5,
  },
  {
    id: "achievement_sphere",
    name: "Achievement Sphere Theme",
    url: "/music/achievement-sphere.mp3",
    category: "planet",
    planet: "achievement-sphere",
    volume: 0.5,
  },
  
  // Menu Music
  {
    id: "menu_theme",
    name: "Main Menu",
    url: "/music/menu-theme.mp3",
    category: "menu",
    volume: 0.4,
  },
];

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 0.5,
      isMuted: false,
      tracks: DEFAULT_TRACKS,

      playTrack: (trackId: string) => {
        const track = get().tracks.find((t) => t.id === trackId);
        if (!track) {
          console.warn("Track not found:", trackId);
          return;
        }
        
        // ✅ FIX: Check if same track is already playing
        const currentTrack = get().currentTrack;
        if (currentTrack === trackId && get().isPlaying) {
          console.log("Track already playing:", trackId);
          return; // Don't restart same track
        }
        
        // Stop current track first
        if (currentTrack) {
          window.dispatchEvent(new CustomEvent("music-stop"));
        }
        
        // Update state
        set({ currentTrack: trackId, isPlaying: true });
        
        console.log("Playing track:", trackId);
      },

      pauseMusic: () => {
        set({ isPlaying: false });
        window.dispatchEvent(new CustomEvent("music-pause"));
      },

      resumeMusic: () => {
        set({ isPlaying: true });
        window.dispatchEvent(new CustomEvent("music-resume"));
      },

      stopMusic: () => {
        set({ currentTrack: null, isPlaying: false });
        window.dispatchEvent(new CustomEvent("music-stop"));
      },

      setVolume: (volume: number) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        set({ volume: newVolume });
        window.dispatchEvent(
          new CustomEvent("music-volume", { detail: { volume: newVolume } })
        );
      },

      toggleMute: () => {
        const newMuted = !get().isMuted;
        set({ isMuted: newMuted });
        window.dispatchEvent(
          new CustomEvent("music-mute", { detail: { muted: newMuted } })
        );
      },

      nextTrack: () => {
        const { currentTrack, tracks } = get();
        if (!currentTrack) {
          // Start with first track
          if (tracks.length > 0) {
            get().playTrack(tracks[0].id);
          }
          return;
        }
        
        const currentIndex = tracks.findIndex((t) => t.id === currentTrack);
        const nextIndex = (currentIndex + 1) % tracks.length;
        get().playTrack(tracks[nextIndex].id);
      },

      previousTrack: () => {
        const { currentTrack, tracks } = get();
        if (!currentTrack) {
          // Start with last track
          if (tracks.length > 0) {
            get().playTrack(tracks[tracks.length - 1].id);
          }
          return;
        }
        
        const currentIndex = tracks.findIndex((t) => t.id === currentTrack);
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        get().playTrack(tracks[prevIndex].id);
      },
    }),
    {
      name: "music-system",
      version: 1,
    }
  )
);