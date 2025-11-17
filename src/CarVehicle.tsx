// src/CarVehicle.tsx
import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "./useControls";
import { useVehicleCustomizationStore } from "./stores/vehicleCustomizationStore";
import { useAchievementTracker } from "./hooks/useAchievementTracker";

type Props = {
  enterPlanet?: (name: string) => void;
};

export default function CarVehicle({ enterPlanet }: Props) {
  const carRef = useRef<THREE.Group | null>(null);
  const wheelRefs = useRef<Array<THREE.Mesh | null>>([]);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const exhaustRefs = useRef<Array<THREE.Mesh | null>>([]);
  const headlightRefs = useRef<Array<THREE.Mesh | null>>([]);
  const neonLinesRef = useRef<THREE.Group | null>(null);

  const forward = useControls((s) => s.forward);
  const back = useControls((s) => s.back);
  const left = useControls((s) => s.left);
  const right = useControls((s) => s.right);
  const boost = useControls((s) => s.boost);

  const customization = useVehicleCustomizationStore((s) => s.car);
  const { trackBoost, trackDistance } = useAchievementTracker();

  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const [nearPlanet, setNearPlanet] = useState<string | null>(null);

  // ✅ FIXED: Listen for near planet updates
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const ev = e as CustomEvent<string>;
      setNearPlanet(ev?.detail ?? null);
    };

    window.addEventListener("update-near-planet", handleUpdate as EventListener);
    return () => window.removeEventListener("update-near-planet", handleUpdate as EventListener);
  }, []);

  // ✅ FIXED: Listen for E key press
  useEffect(() => {
    const handleEntry = () => {
      if (nearPlanet && enterPlanet) {
        console.log("🎯 E key pressed near planet:", nearPlanet);
        enterPlanet(nearPlanet);
      }
    };

    window.addEventListener("trigger-planet-entry", handleEntry);
    return () => window.removeEventListener("trigger-planet-entry", handleEntry);
  }, [nearPlanet, enterPlanet]);

  const exhaustParticles = useMemo(() => {
    const particles = new THREE.BufferGeometry();
    const count = 50;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const trailColor = new THREE.Color(customization.trailColor);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = -Math.random() * 2;

      colors[i * 3] = trailColor.r;
      colors[i * 3 + 1] = trailColor.g;
      colors[i * 3 + 2] = trailColor.b;

      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    return particles;
  }, [customization.trailColor]);

  useFrame((state, delta) => {
    if (!carRef.current) return;

    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.033);

    const ACC = boost ? 18 : 9;
    const TURN_SPEED = 2.5;
    const DAMP = 0.92;

    if (forward) {
      velocity.current.z -= ACC * dt;
    }
    if (back) {
      velocity.current.z += ACC * dt * 0.6;
    }

    if (left) rotation.current += TURN_SPEED * dt;
    if (right) rotation.current -= TURN_SPEED * dt;

    velocity.current.multiplyScalar(DAMP);

    const maxSpeed = boost ? 15 : 8;
    if (velocity.current.length() > maxSpeed) {
      velocity.current.setLength(maxSpeed);
    }

    const rotatedVel = velocity.current.clone();
    rotatedVel.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);

    carRef.current.position.add(rotatedVel.clone().multiplyScalar(dt * 60));
    carRef.current.rotation.y = rotation.current;

    const speed = velocity.current.length();
    carRef.current.position.y = -1.2 + Math.sin(t * 2) * 0.08 + speed * 0.01;
    carRef.current.rotation.z = Math.sin(t * 1.5) * 0.02 + rotatedVel.x * 0.05;
    carRef.current.rotation.x = Math.cos(t * 1.2) * 0.015 - rotatedVel.z * 0.02;

    trackBoost(boost);
    trackDistance({
      x: carRef.current.position.x,
      y: carRef.current.position.y,
      z: carRef.current.position.z,
    });

    wheelRefs.current.forEach((wheel, i) => {
      if (wheel) {
        wheel.rotation.x += dt * (speed * 0.5 + Math.sin(t + i) * 0.3);
      }
    });

    if (glowRef.current) {
      const glowIntensity = (0.5 + Math.sin(t * 3) * 0.2 + speed * 0.05) * customization.glowIntensity;
      glowRef.current.scale.setScalar(1 + glowIntensity * 0.15);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = glowIntensity * 0.4;
    }

    exhaustRefs.current.forEach((exhaust, i) => {
      if (!exhaust) return;
      const phase = t * 4 + i * Math.PI;
      const intensity = (0.5 + Math.sin(phase) * 0.5) * (speed > 0.5 ? 1.5 : 0.5) * customization.glowIntensity;
      exhaust.scale.x = 0.8 + intensity * 0.4;
      const mat = exhaust.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = intensity * 0.7;
    });

    headlightRefs.current.forEach((light, i) => {
      if (!light) return;
      const flicker = (0.9 + Math.sin(t * 20 + i) * 0.1) * customization.glowIntensity;
      const mat = light.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = flicker;
    });

    if (neonLinesRef.current) {
      neonLinesRef.current.children.forEach((child, i) => {
        const mat = ((child as unknown) as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (!mat) return;
        mat.opacity = (0.6 + Math.sin(t * 3 + i * 0.5) * 0.3) * customization.glowIntensity;
      });
    }

    const positions = exhaustParticles.attributes.position.array as Float32Array;
    const count = positions.length / 3;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] -= dt * (2 + speed * 0.5);
      if (positions[i * 3 + 2] < -3) {
        positions[i * 3 + 2] = 0;
        positions[i * 3] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      }
    }
    exhaustParticles.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={carRef} name="player-vehicle" position={[0, -1.2, 0]} scale={1.35}>
      <group>
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.35, 2.3]} />
          <meshStandardMaterial
            color={customization.primaryColor}
            roughness={0.25}
            metalness={0.85}
            envMapIntensity={1.2}
          />
        </mesh>

        <mesh position={[0, 0.32, -0.1]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.28, 2.0]} />
          <meshStandardMaterial
            color={customization.primaryColor}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        <mesh position={[0, 0.15, 1.3]} castShadow>
          <boxGeometry args={[1.2, 0.15, 0.4]} />
          <meshStandardMaterial
            color={customization.primaryColor}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        <mesh position={[0, 0.75, -1.2]} castShadow>
          <boxGeometry args={[1.3, 0.08, 0.35]} />
          <meshStandardMaterial
            color={customization.secondaryColor}
            roughness={0.15}
            metalness={0.95}
            emissive={customization.secondaryColor}
            emissiveIntensity={0.3 * customization.glowIntensity}
          />
        </mesh>

        {[-0.7, 0.7].map((x, i) => (
          <mesh key={`skirt-${i}`} position={[x, 0.0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.15, 2.0]} />
            <meshStandardMaterial
              color={customization.secondaryColor}
              roughness={0.2}
              metalness={0.85}
              emissive={customization.secondaryColor}
              emissiveIntensity={0.2 * customization.glowIntensity}
            />
          </mesh>
        ))}
      </group>

      <group>
        <mesh position={[0, 0.65, -0.15]} castShadow>
          <boxGeometry args={[0.95, 0.6, 1.2]} />
          <meshPhysicalMaterial
            color={customization.accentColor}
            roughness={0.05}
            metalness={0.1}
            transparent
            opacity={0.7}
            transmission={0.9}
            thickness={0.5}
          />
        </mesh>

        <mesh position={[0, 0.7, 0.5]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.9, 0.5, 0.05]} />
          <meshPhysicalMaterial
            color={customization.accentColor}
            roughness={0.02}
            metalness={0.05}
            transparent
            opacity={0.5}
            transmission={0.95}
          />
        </mesh>
      </group>

      <group ref={neonLinesRef}>
        {[-0.72, 0.72].map((x, i) => (
          <React.Fragment key={`neon-${i}`}>
            <mesh position={[x, 0.25, 0]}>
              <boxGeometry args={[0.02, 0.04, 2.2]} />
              <meshBasicMaterial
                color={customization.accentColor}
                transparent
                opacity={0.8 * customization.glowIntensity}
              />
            </mesh>
            <mesh position={[x, 0.25, 0]}>
              <boxGeometry args={[0.08, 0.08, 2.2]} />
              <meshBasicMaterial
                color={customization.glowColor}
                transparent
                opacity={0.2 * customization.glowIntensity}
              />
            </mesh>
          </React.Fragment>
        ))}

        <mesh position={[0, 0.15, 1.48]}>
          <boxGeometry args={[0.8, 0.12, 0.02]} />
          <meshBasicMaterial
            color={customization.accentColor}
            transparent
            opacity={0.9 * customization.glowIntensity}
          />
        </mesh>
      </group>

      {[
        { x: 0.72, z: 1.05 },
        { x: -0.72, z: 1.05 },
        { x: 0.72, z: -1.05 },
        { x: -0.72, z: -1.05 },
      ].map((pos, i) => (
        <group key={`wheel-${i}`} position={[pos.x, -0.08, pos.z]}>
          <mesh
            ref={(el) => (wheelRefs.current[i] = el)}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.32, 0.32, 0.35, 32]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.2} />
          </mesh>

          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.38, 6]} />
            <meshStandardMaterial
              color={customization.secondaryColor}
              roughness={0.15}
              metalness={0.95}
              emissive={customization.secondaryColor}
              emissiveIntensity={0.4 * customization.glowIntensity}
            />
          </mesh>

          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.28, 0.4, 32]} />
            <meshBasicMaterial
              color={customization.glowColor}
              transparent
              opacity={0.15 * customization.glowIntensity}
            />
          </mesh>
        </group>
      ))}

      {[-0.4, 0.4].map((x, i) => (
        <group key={`headlight-${i}`} position={[x, 0.18, 1.52]}>
          <mesh ref={(el) => (headlightRefs.current[i] = el)}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>

          <mesh position={[0, 0, 0.02]}>
            <circleGeometry args={[0.18, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>

          <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 1.5, 8, 1, true]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {[-0.45, 0.45].map((x, i) => (
        <mesh key={`taillight-${i}`} position={[x, 0.2, -1.52]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#ff0040" transparent opacity={0.8} />
        </mesh>
      ))}

      {[-0.35, 0.35].map((x, i) => (
        <group key={`exhaust-${i}`} position={[x, 0.05, -1.5]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
            <meshStandardMaterial
              color={customization.primaryColor}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          <mesh
            ref={(el) => (exhaustRefs.current[i] = el)}
            position={[0, 0, -0.1]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.1, 0.05, 0.2, 16]} />
            <meshBasicMaterial
              color={customization.trailColor}
              transparent
              opacity={0.6 * customization.trailIntensity}
            />
          </mesh>
        </group>
      ))}

      <points position={[0, 0.05, -1.6]}>
        <primitive object={exhaustParticles} attach="geometry" />
        <pointsMaterial
          attach="material"
          size={0.08}
          vertexColors
          transparent
          opacity={0.6 * customization.trailIntensity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh
        ref={glowRef}
        position={[0, -0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.6, 32]} />
        <meshBasicMaterial
          color={customization.glowColor}
          transparent
          opacity={0.4 * customization.glowIntensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group>
        <mesh position={[0, 0.48, 0.4]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshBasicMaterial
            color={customization.accentColor}
            transparent
            opacity={0.3 * customization.glowIntensity}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh position={[0, 0.98, -0.4]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial
            color={customization.accentColor}
            emissive={customization.accentColor}
            emissiveIntensity={0.8 * customization.glowIntensity}
          />
        </mesh>

        <mesh position={[0, 1.12, -0.4]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={customization.glowColor} transparent opacity={0.9} />
        </mesh>
      </group>

      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.8, 32]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}