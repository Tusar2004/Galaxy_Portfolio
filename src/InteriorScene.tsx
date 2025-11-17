// src/InteriorScene.tsx
import { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Text, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import Astronaut from "./Astronaut";
import { useAchievementTracker } from "./hooks/useAchievementTracker";

export default function InteriorScene({
  planet,
  onExit,
}: {
  planet: string;
  onExit: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const [astronautSpawned, setAstronautSpawned] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const { trackInteriorTime } = useAchievementTracker();

  useEffect(() => {
    // Entry animation sequence
    const entryTimer = setTimeout(() => {
      setEntered(true);
    }, 300);

    // ✅ UPDATED: Spawn astronaut faster (already landed)
    const spawnTimer = setTimeout(() => {
      setAstronautSpawned(true);
      setShowExitPrompt(true);
    }, 500); // Changed from 1500ms to 500ms

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(spawnTimer);
    };
  }, []);

  // ESC/E to exit
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key.toLowerCase() === "e") {
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onExit]);

  // Planet-specific themes
  const planetThemes: Record<string, any> = {
    "origin-station": {
      color: "#1577a1",
      bgColor: "#0a1628",
      floorColor: "#0b2b2f",
      title: "ORIGIN STATION",
      subtitle: "Welcome to my journey",
      icon: "🏛️",
    },
    "tech-nebula": {
      color: "#7c3aed",
      bgColor: "#1a0f2e",
      floorColor: "#2d1b4e",
      title: "TECH NEBULA",
      subtitle: "Explore my tech stack",
      icon: "⚡",
    },
    "project-galaxy": {
      color: "#fb923c",
      bgColor: "#2d1810",
      floorColor: "#3d2416",
      title: "PROJECT GALAXY",
      subtitle: "Discover my creations",
      icon: "🚀",
    },
    "career-cosmos": {
      color: "#34d399",
      bgColor: "#0a2e1e",
      floorColor: "#0f3d2a",
      title: "CAREER COSMOS",
      subtitle: "My professional path",
      icon: "💼",
    },
    "achievement-sphere": {
      color: "#f59e0b",
      bgColor: "#2d1f0a",
      floorColor: "#3d2a0f",
      title: "ACHIEVEMENT SPHERE",
      subtitle: "Milestones & achievements",
      icon: "🎯",
    },
    "secret-planet-x": {
      color: "#fbbf24",
      bgColor: "#1a0a2e",
      floorColor: "#2d1b4e",
      title: "PLANET X",
      subtitle: "The secret discovery",
      icon: "🌑",
    },
  };

  const theme = planetThemes[planet] || planetThemes["origin-station"];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 600,
        background: entered ? theme.bgColor : "#000000",
        transition: "background 0.8s ease-out",
      }}
    >
      {/* Entry Animation Overlay */}
      {!entered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle, rgba(14, 165, 233, 0.3), transparent 70%)",
            animation: "fadeOut 0.8s ease-out forwards",
            zIndex: 700,
          }}
        >
          <style>{`
            @keyframes fadeOut {
              to { opacity: 0; pointer-events: none; }
            }
          `}</style>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={[theme.bgColor]} />

        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color={theme.color} distance={25} />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color={theme.color} />
        <pointLight position={[5, 3, 5]} intensity={0.5} color={theme.color} />
        <spotLight position={[0, 10, 0]} angle={0.5} intensity={0.8} castShadow />

        {/* Background Stars */}
        <Stars radius={50} depth={30} count={500} factor={3} fade speed={0.5} />

        <Suspense fallback={<LoadingFallback />}>
          {/* Floor */}
          <group position={[0, -1.5, 0]}>
            <mesh receiveShadow>
              <cylinderGeometry args={[8, 8, 0.4, 64]} />
              <meshStandardMaterial
                color={theme.floorColor}
                metalness={0.7}
                roughness={0.3}
                emissive={theme.color}
                emissiveIntensity={0.2}
              />
            </mesh>

            {[2, 4, 6].map((radius, i) => (
              <mesh key={i} position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius, radius + 0.08, 64]} />
                <meshBasicMaterial color={theme.color} transparent opacity={0.5 - i * 0.1} />
              </mesh>
            ))}

            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh
                  key={`line-${i}`}
                  position={[Math.cos(angle) * 5, 0.22, Math.sin(angle) * 5]}
                  rotation={[-Math.PI / 2, 0, angle]}
                >
                  <planeGeometry args={[0.15, 3]} />
                  <meshBasicMaterial color={theme.color} transparent opacity={0.6} />
                </mesh>
              );
            })}

            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
              const x = Math.cos(angle) * 7;
              const z = Math.sin(angle) * 7;
              return (
                <group key={`pillar-${i}`} position={[x, 1.5, z]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.12, 0.12, 3, 16]} />
                    <meshStandardMaterial
                      color={theme.floorColor}
                      metalness={0.9}
                      roughness={0.1}
                      emissive={theme.color}
                      emissiveIntensity={0.6}
                    />
                  </mesh>

                  <mesh position={[0, 1.7, 0]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color={theme.color} transparent opacity={0.9} />
                  </mesh>
                  
                  <pointLight position={[0, 1.7, 0]} color={theme.color} intensity={0.8} distance={8} />
                </group>
              );
            })}
          </group>

          {/* Titles */}
          <group position={[0, 2.5, -5]}>
            <Text fontSize={0.7} color={theme.color} anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
              {theme.icon}
            </Text>

            <Text
              position={[0, -0.8, 0]}
              fontSize={0.35}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-bold.woff2"
            >
              {theme.title}
            </Text>

            <Text
              position={[0, -1.3, 0]}
              fontSize={0.16}
              color={theme.color}
              anchorX="center"
              anchorY="middle"
            >
              {theme.subtitle}
            </Text>

            <mesh position={[0, -0.4, -0.3]}>
              <planeGeometry args={[10, 3]} />
              <meshBasicMaterial color={theme.color} transparent opacity={0.08} />
            </mesh>
          </group>

          <InfoPillars theme={theme} planet={planet} />
          <FloatingOrbs color={theme.color} />
          <ContentPanels theme={theme} planet={planet} />

          {astronautSpawned && (
            <group position={[0, -1.5, 3]}>
              <Astronaut />
            </group>
          )}

          {!astronautSpawned && <VehicleExitEffect theme={theme} />}

          <AmbientParticles color={theme.color} />

          {entered && (
            <Html center position={[0, -0.5, 6]}>
              <div
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  opacity: 0.8,
                  pointerEvents: "none",
                  background: "rgba(0, 0, 0, 0.6)",
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1px solid ${theme.color}`,
                }}
              >
                🖱️ Drag to rotate • Scroll to zoom • E or ESC to exit
              </div>
            </Html>
          )}
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />

        <InteriorTimeTracker trackInteriorTime={trackInteriorTime} />
      </Canvas>

      {showExitPrompt && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 700,
            animation: "fadeInBtn 0.5s ease-out",
          }}
        >
          <style>{`
            @keyframes fadeInBtn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <button
            onClick={onExit}
            style={{
              padding: "14px 28px",
              borderRadius: 12,
              border: `2px solid ${theme.color}`,
              background: "rgba(2, 6, 23, 0.9)",
              color: theme.color,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              transition: "all 0.3s ease",
              boxShadow: `0 0 20px ${theme.color}40`,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = theme.color;
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(2, 6, 23, 0.9)";
              e.currentTarget.style.color = theme.color;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ← EXIT PLANET (ESC)
          </button>
        </div>
      )}

      {astronautSpawned && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            background: "rgba(2, 6, 23, 0.85)",
            border: `1px solid ${theme.color}40`,
            borderRadius: 10,
            color: "#cbd5e1",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            zIndex: 700,
            animation: "fadeInBtn 0.5s ease-out 0.5s backwards",
          }}
        >
          <span style={{ color: theme.color, fontWeight: 700 }}>💡 TIP:</span> Drag to rotate
          view • Scroll to zoom • Press{" "}
          <span
            style={{
              padding: "2px 8px",
              background: theme.color,
              color: "#000",
              borderRadius: 4,
              fontWeight: 700,
              marginLeft: 4,
              marginRight: 4,
            }}
          >
            E
          </span>{" "}
          or{" "}
          <span
            style={{
              padding: "2px 8px",
              background: theme.color,
              color: "#000",
              borderRadius: 4,
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            ESC
          </span>{" "}
          to return to galaxy
        </div>
      )}
    </div>
  );
}

/* ============================================
   LOADING FALLBACK
   ============================================ */
function LoadingFallback() {
  return (
    <Html center>
      <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>
        Loading interior...
      </div>
    </Html>
  );
}

/* ============================================
   INFO PILLARS
   ============================================ */
function InfoPillars({ theme }: { theme: any; planet: string }) {
  const pillars = [
    { pos: [-5, 0, 0], rot: Math.PI / 2, label: "EXPLORE" },
    { pos: [5, 0, 0], rot: -Math.PI / 2, label: "DISCOVER" },
    { pos: [0, 0, -5], rot: 0, label: "LEARN" },
  ];

  return (
    <group>
      {pillars.map((pillar, i) => (
        <group key={i} position={pillar.pos as [number, number, number]} rotation={[0, pillar.rot, 0]}>
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[2, 1.2, 0.25]} />
            <meshStandardMaterial
              color={theme.color}
              emissive={theme.color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.9}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          <Text
            position={[0, 1, 0.15]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff2"
          >
            {pillar.label}
          </Text>
        </group>
      ))}
    </group>
  );
}

/* ============================================
   FLOATING ORBS
   ============================================ */
function FloatingOrbs({ color }: { color: string }) {
  const orbRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    orbRefs.current.forEach((orb, i) => {
      if (orb) {
        orb.position.y = Math.sin(t * 0.5 + i) * 0.4 + 2;
        orb.rotation.y = t * 0.3;
      }
    });
  });

  const orbPositions = [
    [4, 2, 4],
    [-4, 2, 4],
    [4, 2, -4],
    [-4, 2, -4],
  ];

  return (
    <group>
      {orbPositions.map((pos, i) => (
        <mesh key={i} ref={(el) => el && (orbRefs.current[i] = el)} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
          <pointLight color={color} intensity={0.5} distance={5} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   CONTENT PANELS
   ============================================ */
function ContentPanels({ theme }: { theme: any; planet: string }) {
  return (
    <group position={[0, 1, -3]}>
      <mesh>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial
          color={theme.color}
          transparent
          opacity={0.1}
          emissive={theme.color}
          emissiveIntensity={0.3}
        />
      </mesh>

      <Text
        position={[0, 0.8, 0.1]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff2"
      >
        Welcome to {theme.title}
      </Text>

      <Text
        position={[0, 0.2, 0.1]}
        fontSize={0.14}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
      >
        Explore this section to learn more about my journey,{"\n"}
        skills, projects, and achievements.
      </Text>
    </group>
  );
}

/* ============================================
   AMBIENT PARTICLES
   ============================================ */
function AmbientParticles({ color }: { color: string }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particleData, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================
   VEHICLE EXIT EFFECT
   ============================================ */
function VehicleExitEffect({ theme }: { theme: any }) {
  const effectRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (effectRef.current) {
      effectRef.current.rotation.y = state.clock.elapsedTime * 2;
      effectRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.15);
    }
  });

  return (
    <group ref={effectRef} position={[0, 0, 3]}>
      <mesh>
        <torusGeometry args={[0.6, 0.15, 16, 32]} />
        <meshBasicMaterial color={theme.color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ============================================
   INTERIOR TIME TRACKER
   ============================================ */
function InteriorTimeTracker({ trackInteriorTime }: { trackInteriorTime: (isInside: boolean, delta: number) => void }) {
  useFrame((_state, delta) => {
    trackInteriorTime(true, delta);
  });

  return null;
}
