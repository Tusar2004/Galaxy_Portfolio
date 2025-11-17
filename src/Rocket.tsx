// src/Rocket.tsx
// ============================================
// COMPLETE ROCKET.TSX WITH ALL CHANGES
// ============================================

import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "./useControls";
import RocketFlame from "./RocketFlame";
import ThrusterParticles from "./ThrusterParticles";

// Feature imports
import { useVehicleCustomizationStore } from "./stores/vehicleCustomizationStore";
import { useAchievementTracker } from "./hooks/useAchievementTracker";

export default function Rocket({
  enterPlanet,
}: {
  enterPlanet?: (name: string) => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const velocity = useRef(new THREE.Vector3());
  const accel = useRef(new THREE.Vector3());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  // Enhanced refs for effects
  const trailPositions = useRef<THREE.Vector3[]>([]);
  const wingGlowRefs = useRef<THREE.Mesh[]>([]);
  const cockpitRef = useRef<THREE.Mesh>(null);
  const lastTrailUpdate = useRef(0);
  const throttleCounter = useRef(0);

  const { camera, scene, size } = useThree();

  // Controls
  const forward = useControls((s) => s.forward);
  const back = useControls((s) => s.back);
  const left = useControls((s) => s.left);
  const right = useControls((s) => s.right);
  const boost = useControls((s) => s.boost);

  // Customization & Tracking
  const customization = useVehicleCustomizationStore((s) => s.rocket);
  const { trackBoost, trackDistance } = useAchievementTracker();

  // State
  const [nearPlanet, setNearPlanet] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [speed, setSpeed] = useState(0);

  // ✅ NEW: Listen for planet entry trigger (E key / custom event)
  useEffect(() => {
    const handleEntry = () => {
      if (nearPlanet && enterPlanet) {
        console.log("🎯 trigger-planet-entry fired for:", nearPlanet);
        enterPlanet(nearPlanet);
      }
    };

    window.addEventListener("trigger-planet-entry", handleEntry);
    return () => window.removeEventListener("trigger-planet-entry", handleEntry);
  }, [nearPlanet, enterPlanet]);

  // Main frame loop - OPTIMIZED
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033);
    const g = groupRef.current;
    if (!g) return;

    // Throttle non-critical updates
    throttleCounter.current += dt;
    const shouldUpdateSecondary = throttleCounter.current > 0.033;
    if (shouldUpdateSecondary) throttleCounter.current = 0;

    if (!locked) {
      // Movement input
      const input = new THREE.Vector3(
        (right ? 1 : 0) + (left ? -1 : 0),
        0,
        (back ? 1 : 0) + (forward ? -1 : 0)
      );

      if (input.lengthSq() > 0) {
        input.normalize();

        // Camera-relative movement
        const cam = state.camera;
        const yaw = Math.atan2(
          cam.position.x - g.position.x,
          cam.position.z - g.position.z
        );
        input.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      }

      // Enhanced acceleration with boost
      const ACC = boost ? 22 : 11;
      accel.current.copy(input).multiplyScalar(ACC * dt);
      velocity.current.add(accel.current);

      // Advanced damping with boost consideration
      const DAMP = boost ? 0.985 : 0.96;
      velocity.current.multiplyScalar(Math.pow(DAMP, dt * 60));

      // Speed limits
      const maxSpeed = boost ? 5 : 3;
      if (velocity.current.length() > maxSpeed) {
        velocity.current.setLength(maxSpeed);
      }

      // Apply movement
      g.position.addScaledVector(velocity.current, 1);

      // Enhanced hover with subtle wobble
      const hoverHeight = -1.2;
      const wobble = Math.sin(state.clock.elapsedTime * 2.6) * 0.05;
      const tilt = Math.cos(state.clock.elapsedTime * 1.8) * 0.025;
      g.position.y = hoverHeight + wobble;
      g.rotation.z = tilt;

      // Smooth orientation with banking
      if (velocity.current.lengthSq() > 0.001) {
        tmp.copy(velocity.current).normalize();
        quat.setFromUnitVectors(new THREE.Vector3(0, 0, -1), tmp);
        g.quaternion.slerp(quat, dt * 7);

        // Add banking based on turn rate
        const turnSpeed = input.x * 0.5;
        g.rotation.z += turnSpeed;
      }

      // Update speed for effects (note: causes React re-render)
      setSpeed(velocity.current.length());

      // Track achievements
      trackBoost(boost);
      trackDistance({
        x: g.position.x,
        y: g.position.y,
        z: g.position.z,
      });
    }

    // Planet detection
    let nearest: { name: string; dist: number } | null = null;
    const MAX_RANGE = 60;

    scene.children.forEach((obj) => {
      if (!obj.name || !obj.name.startsWith("planet-")) return;
      const dist = obj.position.distanceTo(g.position);
      if (dist > MAX_RANGE) return;
      if (!nearest || dist < nearest.dist) {
        nearest = { name: obj.name, dist };
      }
    });

    if (nearest) {
      const nname = nearest.name;
      setNearPlanet(nname);

      // No auto-enter here — E/custom event triggers entry
    } else {
      setNearPlanet(null);
    }

    // Wing glow animation (throttled)
    if (shouldUpdateSecondary) {
      wingGlowRefs.current.forEach((glow, i) => {
        if (glow) {
          const mat = glow.material as THREE.MeshBasicMaterial;
          mat.opacity =
            (0.5 + Math.sin(state.clock.elapsedTime * 6 + i) * 0.25) *
            (boost ? 1.8 : 1) *
            customization.glowIntensity;
        }
      });

      // Cockpit glow
      if (cockpitRef.current) {
        const mat = cockpitRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity =
          (0.75 + Math.sin(state.clock.elapsedTime * 3.5) * 0.25) *
          customization.glowIntensity;
      }
    }

    // Trail effect - OPTIMIZED
    const currentTime = state.clock.elapsedTime;
    if (velocity.current.length() > 0.5 && currentTime - lastTrailUpdate.current > 0.08) {
      trailPositions.current.push(g.position.clone());
      if (trailPositions.current.length > 60) {
        trailPositions.current.shift();
      }
      lastTrailUpdate.current = currentTime;
    }

    // HUD update
    const screenPos = g.position.clone().project(camera);
    const x = ((screenPos.x + 1) / 2) * size.width;
    const y = (-(screenPos.y - 1) / 2) * size.height;

    window.dispatchEvent(new CustomEvent("rocket-screen-pos", { detail: { x, y } }));
  });

  return (
    <group ref={groupRef} name="player-rocket" position={[0, -1.2, 0]} scale={1.3}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* MAIN BODY */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.26, 1.4, 32]} />
          <meshStandardMaterial
            color={customization.primaryColor}
            metalness={0.85}
            roughness={0.12}
          />
        </mesh>

        {/* Accent Stripes */}
        {[0.35, 0.05, -0.25].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.225, 0.225, 0.1, 32]} />
            <meshStandardMaterial
              color={customization.secondaryColor}
              metalness={0.95}
              roughness={0.08}
              emissive={customization.secondaryColor}
              emissiveIntensity={0.4 * customization.glowIntensity}
            />
          </mesh>
        ))}

        {/* Nose Cone */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshPhysicalMaterial
            color={customization.accentColor}
            metalness={0.4}
            roughness={0.03}
            transparent
            opacity={0.98}
            transmission={0.15}
            emissive={customization.accentColor}
            emissiveIntensity={0.25 * customization.glowIntensity}
          />
        </mesh>

        {/* Nose Glow */}
        <mesh ref={cockpitRef} position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.28, 28, 28]} />
          <meshBasicMaterial
            color={customization.glowColor}
            transparent
            opacity={0.35 * customization.glowIntensity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Wings */}
        {[-1, 1].map((side, i) => (
          <group key={i}>
            {/* Main Wing */}
            <mesh
              position={[side * 0.38, 0, 0]}
              rotation={[0, 0, side * (Math.PI / 5.5)]}
              castShadow
            >
              <boxGeometry args={[0.55, 0.09, 0.65]} />
              <meshStandardMaterial
                color={customization.primaryColor}
                metalness={0.85}
                roughness={0.18}
              />
            </mesh>

            {/* Wing Tip */}
            <mesh
              position={[side * 0.6, 0, 0]}
              rotation={[0, 0, side * (Math.PI / 4)]}
            >
              <boxGeometry args={[0.18, 0.07, 0.35]} />
              <meshStandardMaterial
                color={customization.secondaryColor}
                metalness={0.95}
                roughness={0.08}
                emissive={customization.secondaryColor}
                emissiveIntensity={0.5 * customization.glowIntensity}
              />
            </mesh>

            {/* Wing Glow */}
            <mesh
              ref={(el) => el && (wingGlowRefs.current[i] = el)}
              position={[side * 0.6, 0, 0]}
            >
              <boxGeometry args={[0.22, 0.12, 0.4]} />
              <meshBasicMaterial
                color={customization.glowColor}
                transparent
                opacity={0.45 * customization.glowIntensity}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Wing Light */}
            <mesh position={[side * 0.65, 0, 0]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshBasicMaterial color={customization.accentColor} />
            </mesh>

            <pointLight
              position={[side * 0.65, 0, 0]}
              color={customization.accentColor}
              intensity={0.6 * customization.glowIntensity}
              distance={3.5}
            />
          </group>
        ))}

        {/* Engine Nozzle */}
        <mesh position={[0, -0.62, 0]} castShadow>
          <coneGeometry args={[0.26, 0.55, 32]} />
          <meshStandardMaterial
            color="#ff7042"
            metalness={0.3}
            roughness={0.32}
            emissive="#ff3500"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Engine Rim */}
        <mesh position={[0, -0.58, 0]}>
          <torusGeometry args={[0.24, 0.045, 18, 36]} />
          <meshStandardMaterial
            color={customization.accentColor}
            metalness={0.95}
            roughness={0.08}
            emissive={customization.accentColor}
            emissiveIntensity={0.6 * customization.glowIntensity}
          />
        </mesh>

        {/* Inner Engine Glow */}
        <mesh position={[0, -0.55, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.15, 32]} />
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Exhaust Flames */}
        <RocketFlame />

        {/* Thruster particles */}
        <ThrusterParticles />

        {/* Side Thrusters */}
        {[-0.2, 0.2].map((x, i) => (
          <group key={i} position={[x, -0.32, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.055, 0.14, 18]} />
              <meshStandardMaterial
                color={customization.primaryColor}
                metalness={0.75}
                roughness={0.28}
              />
            </mesh>

            {boost && (
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.065, 0.045, 0.18, 18]} />
                <meshBasicMaterial
                  color={customization.glowColor}
                  transparent
                  opacity={0.7 * customization.glowIntensity}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )}
          </group>
        ))}

        {/* Speed Lines */}
        {speed > 16 && (
          <group>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              return (
                <mesh
                  key={i}
                  position={[
                    Math.cos(angle) * 0.32,
                    -0.85 - Math.random() * 0.6,
                    Math.sin(angle) * 0.32,
                  ]}
                  rotation={[Math.PI / 2, 0, angle]}
                >
                  <planeGeometry args={[0.06, 0.5]} />
                  <meshBasicMaterial
                    color={customization.trailColor}
                    transparent
                    opacity={0.6 * customization.trailIntensity}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              );
            })}
          </group>
        )}

        {/* Shield when near planet */}
        {nearPlanet && (
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial
              color={customization.glowColor}
              transparent
              opacity={0.18}
              wireframe
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Antenna */}
        <mesh position={[0, 0.4, 0.25]}>
          <cylinderGeometry args={[0.015, 0.015, 0.2, 12]} />
          <meshStandardMaterial
            color={customization.accentColor}
            emissive={customization.accentColor}
            emissiveIntensity={0.8 * customization.glowIntensity}
            metalness={0.9}
          />
        </mesh>

        <mesh position={[0, 0.5, 0.25]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={customization.glowColor} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Trail */}
      {trailPositions.current.length > 1 && (
        <TrailEffect
          positions={trailPositions.current}
          color={customization.trailColor}
          intensity={customization.trailIntensity}
        />
      )}

      {/* Shadow catcher */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.9, 32]} />
        <shadowMaterial opacity={0.55} />
      </mesh>
    </group>
  );
}

/* ============================================
   TRAIL EFFECT COMPONENT
   ============================================ */
function TrailEffect({
  positions,
  color,
  intensity,
}: {
  positions: THREE.Vector3[];
  color: string;
  intensity: number;
}) {
  const trailRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (!trailRef.current) return;

    const points = positions.slice(-40);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // dispose old geometry if present
    try {
      if (trailRef.current.geometry) {
        trailRef.current.geometry.dispose();
      }
    } catch (e) {
      // ignore disposal errors
    }

    trailRef.current.geometry = geometry;
  });

  return (
    <line ref={trailRef as any}>
      <bufferGeometry />
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.45 * intensity}
        linewidth={2.5}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}    