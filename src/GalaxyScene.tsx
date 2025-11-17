// ============================================
// FILE 1: src/GalaxyScene.tsx - COMPLETE CODE
// ============================================

import { Suspense, useMemo, useState, useEffect, Fragment, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";

// Component imports
import CameraRig from "./CameraRig";
import Rocket from "./Rocket";
import CarVehicle from "./CarVehicle";
import AstronautWalker from "./AstronautWalker";
import Planet from "./Planet";
import PlanetPanel from "./PlanetPanel";
import InteriorScene from "./InteriorScene";
import OrbitTrail from "./OrbitTrail";
import MiniMap from "./MiniMap";
import useKeyboard from "./hooks/useKeyboard";

// ✅ NEW: Cinematic components
import HyperjumpTransition from "./components/HyperjumpTransition";
import AdvancedLoadingScreen from "./components/AdvancedLoadingScreen";
import VehicleLandingSequence from "./components/VehicleLandingSequence";
import AstronautControlHUD from "./components/AstronautControlHUD";

// Feature imports
import SecretPlanet from "./components/SecretPlanet";
import { useAchievementTracker } from "./hooks/useAchievementTracker";
import { useMusicStore } from "./stores/musicSystemStore";
import { usePhotoModeStore } from "./stores/photoModeStore";
import { useVehicleCustomizationStore } from "./stores/vehicleCustomizationStore";

// Scene components
import {
  EnhancedPlatform,
  SpaceParticles,
  NebulaClouds,
  DirectionSigns,
  FloatingAsteroids,
} from "./SceneComponents";

// Keyboard Bridge Component
function KeyboardBridge() {
  useKeyboard();
  return null;
}

export default function GalaxyScene({ mode }: { mode: "car" | "rocket" | "walk" }) {
  const [enteredPlanet, setEnteredPlanet] = useState<string | null>(null);
  const [nearPlanet, setNearPlanet] = useState<string | null>(null);
  const [inInterior, setInInterior] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // ✅ NEW: Cinematic entry states
  const [entryStage, setEntryStage] = useState<'none' | 'hyperjump' | 'loading' | 'landing' | 'astronaut'>('none');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedPlanetTheme, setSelectedPlanetTheme] = useState<any>(null);

  // Feature stores
  const { trackPlanetVisit, trackVehicle } = useAchievementTracker();
  const { playTrack } = useMusicStore();
  const isPhotoMode = usePhotoModeStore((s) => s.isPhotoMode);
  const { toggleCustomizer } = useVehicleCustomizationStore();

  // Scene ready effect
  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Track vehicle usage on mount
  useEffect(() => {
    trackVehicle(mode);
  }, [mode, trackVehicle]);

  // ✅ NEW: Planet themes mapping
  const planetThemes: Record<string, any> = {
    "origin-station": {
      color: "#1577a1",
      bgColor: "#0a1628",
      icon: "🛰️",
      label: "ORIGIN STATION",
    },
    "tech-nebula": {
      color: "#7c3aed",
      bgColor: "#1a0f2e",
      icon: "⚡",
      label: "TECH NEBULA",
    },
    "project-galaxy": {
      color: "#fb923c",
      bgColor: "#2d1810",
      icon: "🚀",
      label: "PROJECT GALAXY",
    },
    "career-cosmos": {
      color: "#34d399",
      bgColor: "#0a2e1e",
      icon: "💼",
      label: "CAREER COSMOS",
    },
    "achievement-sphere": {
      color: "#f59e0b",
      bgColor: "#2d1f0a",
      icon: "🎯",
      label: "ACHIEVEMENT SPHERE",
    },
    "secret-planet-x": {
      color: "#fbbf24",
      bgColor: "#1a0a2e",
      icon: "🌑",
      label: "PLANET X",
    },
  };

  // Your Portfolio Planets - Complete Configuration
  const planets = useMemo(
    () => [
      {
        name: "origin-station",
        orbitRadius: 9,
        size: 2.5,
        color: "#1577a1",
        label: "ORIGIN STATION",
        icon: "🛰️",
        angle: 0,
        description: "About Tusar Goswami",
      },
      {
        name: "tech-nebula",
        orbitRadius: 14,
        size: 2.2,
        color: "#7c3aed",
        label: "TECH NEBULA",
        icon: "⚡",
        angle: Math.PI * 0.5,
        description: "Skills & Technology",
      },
      {
        name: "project-galaxy",
        orbitRadius: 19,
        size: 2.4,
        color: "#fb923c",
        label: "PROJECT GALAXY",
        icon: "🚀",
        angle: Math.PI * 0.95,
        description: "Featured Projects",
      },
      {
        name: "career-cosmos",
        orbitRadius: 24,
        size: 2.0,
        color: "#34d399",
        label: "CAREER COSMOS",
        icon: "💼",
        angle: Math.PI * 1.4,
        description: "Experience & Education",
      },
      {
        name: "achievement-sphere",
        orbitRadius: 28,
        size: 1.9,
        color: "#f59e0b",
        label: "ACHIEVEMENT SPHERE",
        icon: "🎯",
        angle: Math.PI * 1.8,
        description: "Certifications & Awards",
      },
    ],
    []
  );

  const followTargetName = mode === "rocket" ? "player-rocket" : "player-vehicle";

  // ✅ NEW: Handle planet entry with cinematic flow
  const handleEnterPlanet = (planetName: string) => {
    console.log("🚀 Starting cinematic entry for:", planetName);
    
    // Get planet theme
    const theme = planetThemes[planetName] || planetThemes["origin-station"];
    setSelectedPlanetTheme(theme);
    setEnteredPlanet(planetName);
    
    // Stage 1: Hyperjump
    setEntryStage('hyperjump');
  };

  // ✅ NEW: Hyperjump complete handler
  const handleHyperjumpComplete = () => {
    console.log("✓ Hyperjump complete, starting loading...");
    setEntryStage('loading');
    
    // Simulate loading progress
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
          console.log("✓ Loading complete, starting landing...");
          setEntryStage('landing');
        }, 500);
      }
      setLoadingProgress(Math.min(100, Math.floor(progress)));
    }, 200);
  };

  // ✅ NEW: Landing complete handler
  const handleLandingComplete = () => {
    console.log("✓ Landing complete, activating astronaut mode...");
    setEntryStage('astronaut');
    setInInterior(true);
    
    // Track achievement
    if (enteredPlanet) {
      trackPlanetVisit(enteredPlanet);
    }
    
    // Play planet-specific music
    const musicMap: Record<string, string> = {
      "origin-station": "origin_station",
      "tech-nebula": "tech_nebula",
      "project-galaxy": "project_galaxy",
      "career-cosmos": "career_cosmos",
      "achievement-sphere": "achievement_sphere",
      "secret-planet-x": "space_ambient_2",
    };
    
    const trackId = musicMap[enteredPlanet || ""];
    if (trackId) {
      playTrack(trackId);
    }
  };

  // Handle exit from interior
  const handleExitInterior = () => {
    console.log("Exiting interior");
    setInInterior(false);
    setEntryStage('none');
    setLoadingProgress(0);
    
    // Resume ambient music
    playTrack("space_ambient_1");
  };

  // Handle panel close
  const handlePanelClose = () => {
    console.log("Closing panel");
    setEnteredPlanet(null);
    setInInterior(false);
    setEntryStage('none');
    setLoadingProgress(0);
    
    // Resume ambient music
    playTrack("space_ambient_1");
  };

  // Photo mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // C key for customizer
      if (e.code === "KeyC" && !inInterior && !enteredPlanet) {
        toggleCustomizer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inInterior, enteredPlanet, toggleCustomizer]);

  return (
    <>
      {/* Keyboard input bridge */}
      <KeyboardBridge />

      {/* ✅ NEW: Cinematic Transitions */}
      <HyperjumpTransition
        active={entryStage === 'hyperjump'}
        planetColor={selectedPlanetTheme?.color || '#0ea5e9'}
        onComplete={handleHyperjumpComplete}
      />

      {entryStage === 'loading' && selectedPlanetTheme && (
        <AdvancedLoadingScreen
          progress={loadingProgress}
          planetTheme={selectedPlanetTheme}
        />
      )}

      {entryStage === 'landing' && selectedPlanetTheme && (
        <VehicleLandingSequence
          vehicleType={mode}
          planetTheme={selectedPlanetTheme}
          onComplete={handleLandingComplete}
        />
      )}

      {/* Interior Scene - Only show when in astronaut mode */}
      {inInterior && enteredPlanet && entryStage === 'astronaut' && (
        <>
          <InteriorScene planet={enteredPlanet} onExit={handleExitInterior} />
          <AstronautControlHUD planetName={selectedPlanetTheme?.label || enteredPlanet} />
        </>
      )}

      {/* Planet Panel - Show when planet selected but NOT in interior */}
      {enteredPlanet && !inInterior && entryStage === 'none' && (
        <PlanetPanel planet={enteredPlanet} onClose={handlePanelClose} />
      )}

      {/* Main 3D Canvas - HIDE during transitions */}
      {entryStage === 'none' && (
        <Canvas
          shadows
          camera={{ position: [0, 5, 20], fov: 60 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }}
        >
          {/* Background color */}
          <color attach="background" args={["#000000"]} />

          {/* Advanced Lighting Setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[15, 25, 15]}
            intensity={1.0}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          
          {/* Colored accent lights */}
          <pointLight position={[0, 12, 0]} intensity={0.6} color="#0ea5e9" distance={60} />
          <pointLight position={[20, 5, -20]} intensity={0.4} color="#8b5cf6" distance={40} />
          <pointLight position={[-20, 5, 20]} intensity={0.4} color="#ec4899" distance={40} />

          {/* Multi-layered Stars for depth */}
          <Stars radius={180} depth={70} count={1000} factor={5} fade speed={0.6} />
          <Stars radius={120} depth={50} count={600} factor={3} fade speed={0.4} />
          <Stars radius={70} depth={30} count={300} factor={1.5} fade speed={0.2} />

          {/* Space fog for atmosphere */}
          <fog attach="fog" args={["#0a0a20", 40, 120]} />
          
          {/* Environment map for reflections */}
          <Environment preset="night" />

          <Suspense fallback={<LoadingScreen />}>
            {/* Central Landing Platform */}
            <EnhancedPlatform />

            {/* Ambient Space Effects */}
            <SpaceParticles />
            <NebulaClouds />

            {/* Your Portfolio Planets */}
            {planets.map((p) => (
              <Planet
                key={p.name}
                name={p.name}
                orbitRadius={p.orbitRadius}
                orbitSpeed={0}
                size={p.size}
                color={p.color}
                label={p.label}
                icon={p.icon}
                onSelect={handleEnterPlanet}
                main={true}
                showTrail={true}
              />
            ))}

            {/* Secret Planet */}
            <SecretPlanet onSelect={handleEnterPlanet} />

            {/* Orbit Trails with Glow */}
            <group rotation={[-Math.PI / 2, 0, 0]}>
              {planets.map((p) => (
                <Fragment key={p.name + "-trail"}>
                  <OrbitTrail radius={p.orbitRadius} ellipseFactor={0.92} color={p.color} />
                  
                  <mesh>
                    <ringGeometry args={[p.orbitRadius - 0.03, p.orbitRadius + 0.03, 128]} />
                    <meshBasicMaterial
                      color={p.color}
                      transparent
                      opacity={0.18}
                      blending={THREE.AdditiveBlending}
                    />
                  </mesh>
                </Fragment>
              ))}
            </group>

            {/* Direction Signs pointing to planets */}
            <DirectionSigns planets={planets} />

            {/* Floating Asteroids for decoration */}
            <FloatingAsteroids count={15} />

            {/* Energy Field around platform */}
            <EnergyField />

            {/* Vehicle/Character Spawner */}
            <VehicleSpawner mode={mode} enterPlanet={handleEnterPlanet} />

            {/* Advanced Camera System */}
            <CameraRig 
              followTargetName={followTargetName} 
              selectedPlanet={inInterior ? null : enteredPlanet}
              introDuration={3}
            />

            {/* Proximity Watcher */}
            <ProximityWatcher
              planets={planets}
              followTargetName={followTargetName}
              onNear={(name) => setNearPlanet(name)}
              onFar={() => setNearPlanet(null)}
            />
          </Suspense>
        </Canvas>
      )}

      {/* DOM UI Overlays - HIDE during transitions */}
      {entryStage === 'none' && (
        <>
          <MiniMap />
          {/* ❌ REMOVED: HUDButtons - No longer needed */}
          
          {/* Customizer Button */}
          {!inInterior && !enteredPlanet && !isPhotoMode && (
            <button
              onClick={toggleCustomizer}
              style={{
                position: "fixed",
                bottom: 100,
                right: 20,
                padding: "12px 24px",
                background: "rgba(14, 165, 233, 0.2)",
                border: "2px solid #0ea5e9",
                borderRadius: 12,
                color: "#00d4ff",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                zIndex: 100,
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(14, 165, 233, 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(14, 165, 233, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🎨 Customize (C)
            </button>
          )}
          
          {/* Controls Helper at bottom */}
          <ControlsHelper mode={mode} />
          
          {/* Proximity Hint - only show when NOT in interior or panel */}
          {nearPlanet && !inInterior && !enteredPlanet && !isPhotoMode && (
            <ProximityHint planetData={planets.find((p) => p.name === nearPlanet)} />
          )}
        </>
      )}
      
      {/* Loading overlay */}
      {!sceneReady && <SceneLoadingOverlay />}
    </>
  );
}

/* Supporting Components - Same as before */
function LoadingScreen() {
  return (
    <Html center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, color: "white", fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: 60, height: 60, border: "3px solid rgba(14, 165, 233, 0.3)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>LOADING UNIVERSE...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

function VehicleSpawner({ mode, enterPlanet }: { mode: string; enterPlanet: (name: string) => void }) {
  if (mode === "rocket") return <Rocket enterPlanet={enterPlanet} />;
  if (mode === "car") return <CarVehicle enterPlanet={enterPlanet} />;
  return <AstronautWalker />;
}

function EnergyField() {
  const fieldRef = useRef<THREE.Mesh>(null);
  useEffect(() => {
    const animate = () => {
      if (fieldRef.current) fieldRef.current.rotation.y += 0.001;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  return (
    <mesh ref={fieldRef} position={[0, 0, 0]}>
      <sphereGeometry args={[6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial color="#0ea5e9" transparent opacity={0.18} side={THREE.DoubleSide} wireframe />
    </mesh>
  );
}

function ProximityWatcher({ planets, followTargetName, onNear, onFar }: any) {
  return null;
}

function ControlsHelper({ mode }: { mode?: string }) {
  return (
    <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "14px 24px", background: "rgba(2, 6, 23, 0.85)", border: "2px solid rgba(14, 165, 233, 0.4)", borderRadius: 12, color: "#cbd5e1", fontSize: 14, fontFamily: "Inter, sans-serif", zIndex: 50, letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)" }}>
      <span style={{ fontWeight: 700, color: "#0ea5e9" }}>WASD</span> Move • <span style={{ fontWeight: 700, color: "#0ea5e9" }}>SHIFT</span> Boost • <span style={{ fontWeight: 700, color: "#0ea5e9" }}>E</span> Enter • <span style={{ fontWeight: 700, color: "#0ea5e9" }}>P</span> Photo • <span style={{ fontWeight: 700, color: "#0ea5e9" }}>C</span> Customize
    </div>
  );
}

function ProximityHint({ planetData }: { planetData?: any }) {
  if (!planetData) return null;
  return (
    <div style={{ position: "fixed", bottom: 80, left: 32, zIndex: 100, animation: "slideIn 0.3s ease-out" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(-100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes glow { 0%, 100% { box-shadow: 0 8px 32px rgba(14, 165, 233, 0.4); } 50% { box-shadow: 0 8px 48px rgba(14, 165, 233, 0.7); } }`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 28px", borderRadius: 16, background: "rgba(2, 6, 23, 0.95)", backdropFilter: "blur(20px)", border: "2px solid rgba(14, 165, 233, 0.5)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)", fontFamily: "Inter, sans-serif", color: "#ffffff", animation: "glow 2s ease-in-out infinite" }}>
        <div style={{ fontSize: 42, filter: "drop-shadow(0 0 10px rgba(14, 165, 233, 0.8))" }}>{planetData.icon}</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6, letterSpacing: 1 }}>{planetData.label}</div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>Press <span style={{ padding: "3px 10px", background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", borderRadius: 6, fontWeight: 800, color: "#ffffff", boxShadow: "0 0 15px rgba(14, 165, 233, 0.6)", marginLeft: 4, marginRight: 4 }}>E</span> to explore {planetData.description}</div>
        </div>
      </div>
    </div>
  );
}

function SceneLoadingOverlay() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "fadeOut 1s ease-out 1s forwards", pointerEvents: "none" }}>
      <div style={{ color: "white", fontSize: 24, fontWeight: 700, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌌</div>
        Building Galaxy...
      </div>
      <style>{`@keyframes fadeOut { to { opacity: 0; } }`}</style>
    </div>
  );
}