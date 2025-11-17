// src/AstronautWalker.tsx
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "./useControls";

type Props = {
  enterPlanet?: (name: string) => void;
};

export default function AstronautWalker({ enterPlanet }: Props) {
  const ref = useRef<THREE.Group>(null);
  
  const forward = useControls((s) => s.forward);
  const back = useControls((s) => s.back);
  const left = useControls((s) => s.left);
  const right = useControls((s) => s.right);
  const boost = useControls((s) => s.boost);
  
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

  useFrame((state, delta) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.033);
    
    const ACC = boost ? 6 : 3;
    const TURN_SPEED = 2.0;
    const DAMP = 0.88;
    
    if (forward) {
      velocity.current.z -= ACC * dt;
    }
    if (back) {
      velocity.current.z += ACC * dt * 0.5;
    }
    
    if (left) {
      rotation.current += TURN_SPEED * dt;
    }
    if (right) {
      rotation.current -= TURN_SPEED * dt;
    }
    
    velocity.current.multiplyScalar(DAMP);
    
    const maxSpeed = boost ? 8 : 4;
    if (velocity.current.length() > maxSpeed) {
      velocity.current.setLength(maxSpeed);
    }
    
    const rotatedVel = velocity.current.clone();
    rotatedVel.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
    
    ref.current.position.add(rotatedVel.clone().multiplyScalar(dt * 60));
    ref.current.rotation.y = rotation.current;

    const speed = velocity.current.length();
    ref.current.position.y = Math.sin(t * 2) * 0.03 - 1.2 + speed * 0.005;

    const swayAmount = Math.max(0, 1 - speed * 0.2);
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.1 * swayAmount;

    const head = ref.current.getObjectByName("astro-head");
    if (head) {
      head.rotation.x = Math.sin(t * 1.5) * 0.12;
      head.rotation.y = Math.sin(t * 0.8) * 0.08;
    }
    
    if (speed > 0.1) {
      const walkCycle = t * speed * 2;
      ref.current.position.y += Math.sin(walkCycle * 4) * 0.02;
      ref.current.rotation.x = -speed * 0.1;
    }
  });

  return (
    <group ref={ref} name="player-vehicle" position={[0, -1.2, 0]} scale={1.15}>
      <mesh name="astro-head" position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#e8f0ff" roughness={0.25} metalness={0.1} />
        
        <mesh position={[0, 0, 0.28]}>
          <sphereGeometry args={[0.25, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#1a3a4a"
            metalness={0.9}
            roughness={0.05}
            transparent
            opacity={0.7}
            transmission={0.3}
          />
        </mesh>
        
        <mesh position={[0, 0.1, 0.3]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.75, 0.34]} />
        <meshStandardMaterial color="#ffffff" roughness={0.45} metalness={0.1} />
        
        <mesh position={[0, 0.15, 0.18]}>
          <boxGeometry args={[0.3, 0.4, 0.02]} />
          <meshStandardMaterial color="#1a3a4a" metalness={0.6} roughness={0.3} />
        </mesh>
      </mesh>

      <mesh position={[0.47, 0, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.22, 0.65, 0.2]} />
        <meshStandardMaterial color="#dce4ff" />
        
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.2, 0.35, 0.18]} />
          <meshStandardMaterial color="#c5d0ff" />
        </mesh>
      </mesh>
      <mesh position={[-0.47, 0, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.22, 0.65, 0.2]} />
        <meshStandardMaterial color="#dce4ff" />
        
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.2, 0.35, 0.18]} />
          <meshStandardMaterial color="#c5d0ff" />
        </mesh>
      </mesh>

      <mesh position={[0.19, -0.65, 0]}>
        <boxGeometry args={[0.22, 0.75, 0.24]} />
        <meshStandardMaterial color="#cfd8ff" />
        
        <mesh position={[0, -0.45, 0.03]}>
          <boxGeometry args={[0.24, 0.15, 0.28]} />
          <meshStandardMaterial color="#a0b0ff" metalness={0.4} />
        </mesh>
      </mesh>
      <mesh position={[-0.19, -0.65, 0]}>
        <boxGeometry args={[0.22, 0.75, 0.24]} />
        <meshStandardMaterial color="#cfd8ff" />
        
        <mesh position={[0, -0.45, 0.03]}>
          <boxGeometry args={[0.24, 0.15, 0.28]} />
          <meshStandardMaterial color="#a0b0ff" metalness={0.4} />
        </mesh>
      </mesh>
      
      <mesh position={[0, 0.1, -0.22]}>
        <boxGeometry args={[0.38, 0.5, 0.18]} />
        <meshStandardMaterial color="#1a3a4a" metalness={0.5} roughness={0.4} />
      </mesh>
      
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.4, 24]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </group>
  );
}