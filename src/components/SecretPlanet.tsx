// src/components/SecretPlanet.tsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useEasterEggStore } from "../systems/easterEggSystem";

export default function SecretPlanet({ onSelect }: { onSelect?: (name: string) => void }) {
  const secretPlanetUnlocked = useEasterEggStore((s) => s.secretPlanetUnlocked);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<THREE.Group>(null);
  
  // Secret planet position - far away from main planets
  const position = useMemo(() => new THREE.Vector3(-40, 8, -50), []);
  
  // Animated texture
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    
    // Black base
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 512, 512);
    
    // Golden cracks
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * 80 + 20;
      
      ctx.strokeStyle = `rgba(251, 191, 36, ${Math.random() * 0.6 + 0.2})`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
    }
    
    // Purple glow spots
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 40 + 10;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.4)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !ringRef.current) return;
    
    const t = state.clock.elapsedTime;
    
    // Mysterious rotation
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    
    // Pulsing glow
    const glowScale = 2.8 + Math.sin(t * 2) * 0.3;
    glowRef.current.scale.setScalar(glowScale);
    
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
    glowMat.opacity = 0.15 + Math.sin(t * 2) * 0.08;
    
    // Rotating rings
    ringRef.current.rotation.z = t * 0.5;
    
    // Label animation
    if (labelRef.current) {
      labelRef.current.position.y = position.y + 3 + Math.sin(t * 1.5) * 0.15;
      labelRef.current.rotation.y = -meshRef.current.rotation.y;
    }
  });

  // Don't render if not unlocked
  if (!secretPlanetUnlocked) return null;

  return (
    <group name="planet-secret-planet-x" position={position}>
      {/* Main planet */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect && onSelect("secret-planet-x")}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.7}
          roughness={0.3}
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Mysterious rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[2.8, 3.2, 64]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 2.5, 0, Math.PI / 4]}>
        <ringGeometry args={[3.0, 3.3, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floating particles around planet */}
      <ParticleField position={position} />

      {/* Label */}
      <group ref={labelRef}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
          color="#fbbf24"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          🌑
        </Text>
        
        <Text
          position={[0, 0, 0]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#000000"
          font="/fonts/inter-bold.woff"
        >
          PLANET X
        </Text>

        <Text
          position={[0, -0.35, 0]}
          fontSize={0.12}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          Secret Discovery
        </Text>

        {/* Glowing background */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[3, 1.2]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Question marks floating around (before discovery hint) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <Text
            key={i}
            position={[
              Math.cos(angle) * 3.5,
              Math.sin(angle * 0.5) * 0.5,
              Math.sin(angle) * 3.5,
            ]}
            fontSize={0.3}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
          >
            ?
          </Text>
        );
      })}
    </group>
  );
}

// Particle field around secret planet
function ParticleField({ position: _position }: { position: THREE.Vector3 }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Gold and purple particles
      const color = new THREE.Color(Math.random() > 0.5 ? "#fbbf24" : "#8b5cf6");
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}