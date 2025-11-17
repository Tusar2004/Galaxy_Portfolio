// src/Planet.tsx
import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

type PlanetProps = {
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  color?: string;
  onSelect?: (name: string) => void;
  main?: boolean;
  showTrail?: boolean;
  label?: string;
  icon?: string;
};

export default function Planet({
  name,
  orbitRadius,
  orbitSpeed,
  size,
  color = "#2ea6ff",
  onSelect,
  main = true,
  showTrail = true,
  label,
  icon = "🌍",
}: PlanetProps) {
  const { scene } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const attractionRingRef = useRef<THREE.Mesh>(null);
  const labelGroupRef = useRef<THREE.Group>(null);
  
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const [hovered, setHovered] = useState(false);
  const [nearby, setNearby] = useState(false);
  const tilt = useMemo(() => (Math.random() - 0.5) * 0.4, []);
  const hasRings = useMemo(() => name === "tech-nebula" || name === "project-galaxy", [name]);
  
  const trailPositions = useRef<THREE.Vector3[]>([]);
  const trailRef = useRef<THREE.Line>(null);
  const lastTrailUpdate = useRef(0);

  // ✅ FIXED: Proximity detection for ALL vehicles
  useEffect(() => {
    const checkProximity = () => {
      if (!meshRef.current) return;
      
      // Check all vehicle types
      const vehicles = [
        scene.getObjectByName("player-vehicle"),
        scene.getObjectByName("player-rocket"),
      ];
      
      let isNear = false;
      const threshold = size * 3.5;
      
      for (const vehicle of vehicles) {
        if (vehicle) {
          const distance = vehicle.position.distanceTo(meshRef.current.position);
          if (distance < threshold) {
            isNear = true;
            break;
          }
        }
      }
      
      setNearby(isNear);
      
      // Dispatch proximity event
      if (isNear) {
        window.dispatchEvent(new CustomEvent('update-near-planet', { detail: name }));
      }
    };
    
    const interval = setInterval(checkProximity, 100);
    return () => clearInterval(interval);
  }, [name, size, scene]);

  const planetTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const textureSize = 1024;
    canvas.width = textureSize;
    canvas.height = textureSize;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, textureSize, textureSize);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, new THREE.Color(color).multiplyScalar(0.7).getStyle());
    gradient.addColorStop(1, new THREE.Color(color).multiplyScalar(0.4).getStyle());
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, textureSize, textureSize);

    for (let i = 0; i < 25; i++) {
      const x = Math.random() * textureSize;
      const y = Math.random() * textureSize;
      const radius = 60 + Math.random() * 180;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${0.25 + Math.random() * 0.18})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, textureSize, textureSize);
    }

    if (name === "tech-nebula" || name === "project-galaxy") {
      ctx.strokeStyle = "rgba(0, 255, 220, 0.35)";
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * textureSize, Math.random() * textureSize);
        ctx.lineTo(Math.random() * textureSize, Math.random() * textureSize);
        ctx.stroke();
      }
    }

    for (let i = 0; i < 600; i++) {
      const x = Math.random() * textureSize;
      const y = Math.random() * textureSize;
      const w = Math.random() * 35 + 12;
      const h = Math.random() * 18 + 6;
      ctx.globalAlpha = 0.04 + Math.random() * 0.07;
      ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, [color, name]);

  const normalMap = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    
    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 28 + 6;
      ctx.fillStyle = `rgba(${Math.random() * 100 + 110}, ${Math.random() * 100 + 110}, 255, 0.45)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    if (meshRef.current) {
      const x = Math.cos(angleRef.current) * orbitRadius;
      const z = Math.sin(angleRef.current) * orbitRadius * 0.85;
      meshRef.current.position.set(x, 0, z);
    }
  }, [orbitRadius]);

  useFrame((state, dt) => {
    if (!meshRef.current) return;

    angleRef.current += orbitSpeed * dt * 0.5;
    const x = Math.cos(angleRef.current) * orbitRadius;
    const z = Math.sin(angleRef.current) * orbitRadius * 0.85;
    const y = Math.sin(angleRef.current * 0.35) * 0.25;
    
    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.y += dt * 0.2;
    meshRef.current.rotation.x = tilt;

    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      glowRef.current.rotation.copy(meshRef.current.rotation);
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.08;
      glowRef.current.scale.setScalar(size * 1.4 * pulseScale);
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.position.copy(meshRef.current.position);
      atmosphereRef.current.rotation.y += dt * 0.15;
      atmosphereRef.current.scale.setScalar(size * 1.25);
    }

    if (ringsRef.current && hasRings) {
      ringsRef.current.position.copy(meshRef.current.position);
      ringsRef.current.rotation.x = Math.PI / 2 + tilt;
      ringsRef.current.rotation.z += dt * 0.4;
    }

    if (attractionRingRef.current) {
      attractionRingRef.current.position.copy(meshRef.current.position);
      attractionRingRef.current.rotation.x = -Math.PI / 2;
      
      if (nearby) {
        const pulseSize = 1 + Math.sin(state.clock.elapsedTime * 5.5) * 0.18;
        attractionRingRef.current.scale.setScalar(pulseSize);
        
        const mat = attractionRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.45 + Math.sin(state.clock.elapsedTime * 5.5) * 0.28;
      } else {
        attractionRingRef.current.scale.setScalar(0);
      }
    }

    if (labelGroupRef.current) {
      labelGroupRef.current.position.copy(meshRef.current.position);
      labelGroupRef.current.position.y += size + 1.0 + Math.sin(state.clock.elapsedTime * 2.2) * 0.1;
      
      // ✅ FIXED: Keep label always facing camera
      const camera = state.camera;
      labelGroupRef.current.lookAt(camera.position);
    }

    const targetScale = hovered || nearby ? size * 1.15 : size;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.15
    );

    const currentTime = state.clock.elapsedTime;
    if (showTrail && currentTime - lastTrailUpdate.current > 0.12) {
      trailPositions.current.push(meshRef.current.position.clone());
      if (trailPositions.current.length > 70) {
        trailPositions.current.shift();
      }
      lastTrailUpdate.current = currentTime;
    }

    if (trailRef.current && showTrail) {
      const positions = new Float32Array(trailPositions.current.length * 3);
      trailPositions.current.forEach((pos, i) => {
        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;
      });
      trailRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  });

  // ✅ FIXED: Click handler
  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log("🎯 Planet clicked:", name);
    if (onSelect) {
      onSelect(name);
    }
  };

  return (
    <group name={`planet-${name}`}>
      {showTrail && trailPositions.current.length > 1 && (
        <line ref={trailRef as any}>
          <bufferGeometry />
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0.38}
            linewidth={2.5}
            blending={THREE.AdditiveBlending}
          />
        </line>
      )}

      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={new THREE.Color(color).multiplyScalar(1.7)}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ✅ FIXED: Clickable mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={planetTexture}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.7, 0.7)}
          metalness={0.4}
          roughness={0.5}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>

      {hasRings && (
        <mesh ref={ringsRef}>
          <ringGeometry args={[1.6, 2.5, 64]} />
          <meshBasicMaterial
            color={new THREE.Color(color).multiplyScalar(0.8)}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <mesh ref={attractionRingRef}>
        <ringGeometry args={[size * 1.5, size * 1.7, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {main && (
        <group ref={labelGroupRef}>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.45}
            anchorX="center"
            anchorY="middle"
          >
            {icon}
          </Text>
          
          <Text
            position={[0, 0, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.025}
            outlineColor="#000000"
            font="/fonts/inter-bold.woff"
          >
            {label || name.toUpperCase()}
          </Text>

          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.45, 12]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.55}
            />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2.8, 0.9]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}

      {(hovered || nearby) && <ParticleRing position={meshRef.current?.position} size={size} color={color} />}
    </group>
  );
}

function ParticleRing({ position, size, color }: { position?: THREE.Vector3; size: number; color: string }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const count = 140;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorObj = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = size * 1.7;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }
    
    return [positions, colors];
  }, [size, color]);
  
  useFrame((state) => {
    if (particlesRef.current && position) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 2.8;
      particlesRef.current.position.copy(position);
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}