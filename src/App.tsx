import { useState, useEffect } from "react";
import StartScreen from "./StartScreen";
import ModeSelect from "./ModeSelect";
import GalaxyScene from "./GalaxyScene";
import "./App.css";

// ✅ NEW: Feature imports
import AchievementPopup from "./components/AchievementPopup";
import AchievementProgress from "./components/AchievementProgress";
import PhotoModeUI from "./components/PhotoModeUI";
import VehicleCustomizerUI from "./components/VehicleCustomizerUI";
import MusicPlayerUI from "./components/MusicPlayerUI";
import EasterEggNotification from "./components/EasterEggNotification";
import { initializeEasterEggListeners } from "./systems/easterEggSystem";
import { useMusicStore } from "./stores/musicSystemStore";

export default function App() {
  const [_started, setStarted] = useState(false);
  const [mode, setMode] = useState<"car" | "rocket" | "walk" | null>(null);
  const [transition, setTransition] = useState<"none" | "start-to-mode" | "mode-to-galaxy">("none");
  const [showScene, setShowScene] = useState<"start" | "mode" | "galaxy">("start");
  
  // ✅ Music store
  const { playTrack } = useMusicStore();

  // ✅ Initialize Easter Eggs
  useEffect(() => {
    initializeEasterEggListeners();
  }, []);

  // Handle start screen transition
  const handleStart = () => {
    setTransition("start-to-mode");
    setTimeout(() => {
      setStarted(true);
      setShowScene("mode");
      setTransition("none");
    }, 800);
  };

  // Handle mode selection transition
  const handleModeSelect = (selectedMode: "car" | "rocket" | "walk") => {
    setTransition("mode-to-galaxy");
    setTimeout(() => {
      setMode(selectedMode);
      setShowScene("galaxy");
      setTransition("none");
      
      // ✅ Play ambient music when entering galaxy
      playTrack("space_ambient_1");
    }, 1000);
  };

  // Preload assets when app mounts
  useEffect(() => {
    const preloadAudio = () => {
      const audio1 = new Audio("/space-start.mp3");
      const audio2 = new Audio("/click.mp3");
      audio1.load();
      audio2.load();
    };
    preloadAudio();
  }, []);

  return (
    <div className="app-container">
      {/* Start Screen */}
      {showScene === "start" && (
        <div className={`screen-wrapper ${transition === "start-to-mode" ? "fade-out" : "fade-in"}`}>
          <StartScreen onStart={handleStart} />
        </div>
      )}

      {/* Mode Select Screen */}
      {showScene === "mode" && (
        <div className={`screen-wrapper ${transition === "mode-to-galaxy" ? "zoom-out" : "fade-in"}`}>
          <ModeSelect onSelect={handleModeSelect} />
        </div>
      )}

      {/* Galaxy Scene */}
      {showScene === "galaxy" && mode && (
        <div className={`screen-wrapper ${transition === "none" ? "fade-in" : ""}`}>
          <GalaxyScene mode={mode} />
        </div>
      )}

      {/* Transition Overlay */}
      {transition !== "none" && (
        <div className="transition-overlay">
          <div className="transition-particles">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
          <div className="transition-text">
            {transition === "start-to-mode" && "INITIALIZING SYSTEMS..."}
            {transition === "mode-to-galaxy" && "ENTERING GALAXY..."}
          </div>
        </div>
      )}

      {/* Loading Progress Bar */}
      {transition !== "none" && (
        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
        </div>
      )}

      {/* ✅ NEW: Feature Components - Only show in galaxy */}
      {showScene === "galaxy" && (
        <>
          <AchievementPopup />
          <AchievementProgress />
          <PhotoModeUI />
          <VehicleCustomizerUI />
          <MusicPlayerUI />
          <EasterEggNotification />
        </>
      )}
    </div>
  );
}