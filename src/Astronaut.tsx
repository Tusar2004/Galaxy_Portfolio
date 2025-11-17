import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Astronaut() {
  const ref = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const breathingPhase = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    // Starting above ground – cinematic drop animation
    ref.current.position.set(0, 3.2, 0);
    velocity.current = -0.01;
  }, []);

  useFrame((state, dt) => {
    if (!ref.current) return;

    const astronaut = ref.current;
    const t = state.clock.elapsedTime;

    // 🟡 Natural drop landing with realistic physics
    if (astronaut.position.y > 0) {
      astronaut.position.y += velocity.current;
      velocity.current += dt * -1.2; // Gravity acceleration

      // Slight rotation during fall
      astronaut.rotation.x = Math.sin(t * 2) * 0.08;
    } else {
      // Landed
      astronaut.position.y = 0;
      velocity.current = 0;
      astronaut.rotation.x *= 0.95; // Stabilize rotation
    }

    // 🌀 Enhanced breathing / idle motion
    breathingPhase.current = t * 1.8;
    const breathIntensity = 0.004;
    astronaut.position.y += Math.sin(breathingPhase.current) * breathIntensity;

    // Subtle idle rotation and sway
    const idleRotation = Math.sin(t * 0.6) * 0.15;
    const idleSway = Math.cos(t * 0.8) * 0.05;
    astronaut.rotation.y = idleRotation;
    astronaut.rotation.z = idleSway;

    // Head look around animation
    const head = astronaut.children.find((child) => child.name === "astronaut-head");
    if (head) {
      head.rotation.y = Math.sin(t * 0.4) * 0.3;
      head.rotation.x = Math.sin(t * 0.6) * 0.1;
    }

    // Arms subtle movement
    const leftArm = astronaut.children.find((child) => child.name === "left-arm");
    const rightArm = astronaut.children.find((child) => child.name === "right-arm");
    
    if (leftArm) {
      leftArm.rotation.x = Math.sin(t * 0.7) * 0.15;
    }
    if (rightArm) {
      rightArm.rotation.x = Math.sin(t * 0.7 + Math.PI) * 0.15;
    }
  });

  return (
    <group ref={ref} name="player-vehicle">  {/* ✅ FIXED: Added name prop */}
      {/* ===== HEAD/HELMET ===== */}
      <mesh name="astronaut-head" position={[0, 1.15, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ffe9b8" 
          roughness={0.35} 
          metalness={0.12}
        />
        
        {/* Visor - Transparent */}
        <mesh position={[0, 0.05, 0.22]}>
          <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#1a3a4a"
            metalness={0.9}
            roughness={0.05}
            transparent
            opacity={0.7}
            transmission={0.3}
          />
        </mesh>

        {/* Helmet light */}
        <mesh position={[0, 0.15, 0.28]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <pointLight
          position={[0, 0.15, 0.35]}
          color="#00ffff"
          intensity={0.4}
          distance={2.5}
        />
      </mesh>

      {/* ===== BODY/TORSO ===== */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.58, 1.05, 0.38]} />
        <meshStandardMaterial 
          color="#0d1b2a" 
          roughness={0.55} 
          metalness={0.25}
        />
        
        {/* Chest panel */}
        <mesh position={[0, 0.2, 0.2]}>
          <boxGeometry args={[0.35, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#1a3a4a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Life support indicator */}
        <mesh position={[0, 0.25, 0.22]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      </mesh>

      {/* ===== LEFT ARM ===== */}
      <mesh 
        name="left-arm"
        position={[-0.42, 0.55, 0]} 
        rotation={[0, 0, 0.25]} 
        castShadow
      >
        <boxGeometry args={[0.2, 0.75, 0.2]} />
        <meshStandardMaterial color="#142c46" roughness={0.5} metalness={0.2} />
        
        {/* Forearm */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.18]} />
          <meshStandardMaterial color="#0d1b2a" />
        </mesh>

        {/* Glove */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.16, 0.15, 0.16]} />
          <meshStandardMaterial color="#1a3a4a" metalness={0.6} />
        </mesh>
      </mesh>

      {/* ===== RIGHT ARM ===== */}
      <mesh 
        name="right-arm"
        position={[0.42, 0.55, 0]} 
        rotation={[0, 0, -0.25]} 
        castShadow
      >
        <boxGeometry args={[0.2, 0.75, 0.2]} />
        <meshStandardMaterial color="#142c46" roughness={0.5} metalness={0.2} />
        
        {/* Forearm */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.18, 0.4, 0.18]} />
          <meshStandardMaterial color="#0d1b2a" />
        </mesh>

        {/* Glove */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[0.16, 0.15, 0.16]} />
          <meshStandardMaterial color="#1a3a4a" metalness={0.6} />
        </mesh>
      </mesh>

      {/* ===== LEFT LEG ===== */}
      <mesh position={[-0.2, -0.38, 0]} castShadow>
        <boxGeometry args={[0.24, 0.95, 0.24]} />
        <meshStandardMaterial color="#1b263b" roughness={0.6} metalness={0.15} />
        
        {/* Boot */}
        <mesh position={[0, -0.55, 0.05]}>
          <boxGeometry args={[0.26, 0.18, 0.32]} />
          <meshStandardMaterial color="#0d1b2a" metalness={0.5} />
        </mesh>
      </mesh>

      {/* ===== RIGHT LEG ===== */}
      <mesh position={[0.2, -0.38, 0]} castShadow>
        <boxGeometry args={[0.24, 0.95, 0.24]} />
        <meshStandardMaterial color="#1b263b" roughness={0.6} metalness={0.15} />
        
        {/* Boot */}
        <mesh position={[0, -0.55, 0.05]}>
          <boxGeometry args={[0.26, 0.18, 0.32]} />
          <meshStandardMaterial color="#0d1b2a" metalness={0.5} />
        </mesh>
      </mesh>

      {/* ===== BACKPACK/LIFE SUPPORT ===== */}
      <mesh position={[0, 0.6, -0.25]} castShadow>
        <boxGeometry args={[0.45, 0.6, 0.2]} />
        <meshStandardMaterial
          color="#1a3a4a"
          metalness={0.6}
          roughness={0.4}
        />
        
        {/* Oxygen tanks */}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} position={[x, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
            <meshStandardMaterial
              color="#0ea5e9"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </mesh>

      {/* ===== SHOULDER LIGHTS ===== */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.95, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ff4400" />
          <pointLight
            position={[0, 0, 0]}
            color="#ff4400"
            intensity={0.3}
            distance={2}
          />
        </mesh>
      ))}

      {/* ===== BELT/TOOL HOLDER ===== */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.32, 0.04, 16, 32]} />
        <meshStandardMaterial
          color="#0ea5e9"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* ===== SHADOW PLANE ===== */}
      <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.5, 32]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}