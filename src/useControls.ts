import { create } from "zustand";

interface ControlsState {
  forward: boolean;
  back: boolean;  // ✅ FIXED: Consistent naming (Rocket uses "back")
  left: boolean;
  right: boolean;
  boost: boolean;
  interact: boolean;

  setKey: (key: keyof ControlsState, value: boolean) => void;
}

export const useControls = create<ControlsState>((set) => ({
  forward: false,
  back: false,  // ✅ Movement backward
  left: false,
  right: false,
  boost: false,
  interact: false,

  setKey: (key, value) =>
    set(() => ({
      [key]: value,
    })),
}));