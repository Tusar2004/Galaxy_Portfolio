// ============================================
// FILE 5: src/hooks/useKeyboard.ts - E key trigger
// ============================================

import { useEffect } from "react";
import { useControls } from "../useControls";
import { usePhotoModeStore } from "../stores/photoModeStore";
import { useVehicleCustomizationStore } from "../stores/vehicleCustomizationStore";
import { useMusicStore } from "../stores/musicSystemStore";

export default function useKeyboard() {
  const setKey = useControls((s) => s.setKey);
  const { togglePhotoMode, capturePhoto } = usePhotoModeStore();
  const { toggleCustomizer } = useVehicleCustomizationStore();
  const { pauseMusic, resumeMusic, nextTrack, previousTrack } = useMusicStore();
  const isPhotoMode = usePhotoModeStore((s) => s.isPhotoMode);
  const isPlaying = useMusicStore((s) => s.isPlaying);

  useEffect(() => {
    function onDown(e: KeyboardEvent) {
      // Movement controls
      if (e.code === "KeyW") setKey("forward", true);
      if (e.code === "KeyS") setKey("back", true);
      if (e.code === "KeyA") setKey("left", true);
      if (e.code === "KeyD") setKey("right", true);

      // Boost
      if (e.shiftKey) setKey("boost", true);

      // ✅ UPDATED: E key triggers cinematic entry
      if (e.code === "KeyE") {
        window.dispatchEvent(new CustomEvent("trigger-planet-entry"));
        setKey("interact", true);
      }

      // Photo Mode (P key)
      if (e.code === "KeyP") {
        togglePhotoMode();
      }

      // Capture Photo (Space in photo mode)
      if (e.code === "Space" && isPhotoMode) {
        e.preventDefault();
        const canvas = document.querySelector("canvas");
        if (canvas) {
          const imageData = canvas.toDataURL("image/png");
          capturePhoto(imageData);
          window.dispatchEvent(new CustomEvent("photo-taken"));
        }
      }

      // Vehicle Customizer (C key)
      if (e.code === "KeyC" && !isPhotoMode) {
        toggleCustomizer();
      }

      // Music Controls
      if (e.code === "KeyM" && !isPhotoMode) {
        if (isPlaying) {
          pauseMusic();
        } else {
          resumeMusic();
        }
      }

      // Next/Previous Track
      if (e.code === "ArrowRight" && e.ctrlKey) {
        e.preventDefault();
        nextTrack();
      }
      if (e.code === "ArrowLeft" && e.ctrlKey) {
        e.preventDefault();
        previousTrack();
      }

      // Achievement Panel (A key)
      if (e.code === "KeyA" && !isPhotoMode) {
        window.dispatchEvent(new CustomEvent("toggle-achievements"));
      }

      // Gallery (Tab in photo mode)
      if (e.code === "Tab" && isPhotoMode) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toggle-gallery"));
      }
    }

    function onUp(e: KeyboardEvent) {
      if (e.code === "KeyW") setKey("forward", false);
      if (e.code === "KeyS") setKey("back", false);
      if (e.code === "KeyA") setKey("left", false);
      if (e.code === "KeyD") setKey("right", false);

      if (!e.shiftKey) setKey("boost", false);

      if (e.code === "KeyE") setKey("interact", false);
    }

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [setKey, togglePhotoMode, isPhotoMode, capturePhoto, toggleCustomizer, isPlaying, pauseMusic, resumeMusic, nextTrack, previousTrack]);
}