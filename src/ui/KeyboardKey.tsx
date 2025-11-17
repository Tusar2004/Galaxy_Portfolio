import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function KeyboardKey({
  label,
  position = [0, 0, 0] as [number, number, number],
  size = [0.55, 0.18, 0.55] as [number, number, number],
  scatterRadius = 1.0,
  resetDelay = 2700,
}: {
  label: string;
  position?: [number, number, number];
  size?: [number, number, number];
  scatterRadius?: number;
  resetDelay?: number;
}) {
  const mesh = useRef<THREE.Mesh | null>(null);
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const scattered = useRef(false);
  const home = useRef(new THREE.Vector3(...position));
  const idRef = useRef(Math.random());

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    if (scattered.current) {
      vel.current.y -= delta * 9.8 * 0.5;
      m.position.addScaledVector(vel.current, delta);
      m.rotation.x += vel.current.x * delta * 0.6;
      m.rotation.z += vel.current.z * delta * 0.6;
    } else {
      const bob = Math.sin(state.clock.elapsedTime * 1.4 + idRef.current) * 0.015;
      m.position.lerp(home.current.clone().add(new THREE.Vector3(0, bob, 0)), 0.08);
      m.rotation.x *= 0.95;
      m.rotation.z *= 0.95;
    }

    const r = state.scene.getObjectByName("player-rocket") as any;
    if (r && !scattered.current) {
      const d = m.position.distanceTo(r.position);
      if (d < scatterRadius) {
        scattered.current = true;
        vel.current.set((Math.random() - 0.5) * 6, Math.random() * 3 + 2, (Math.random() - 0.5) * 3);
        setTimeout(() => {
          scattered.current = false;
          vel.current.set(0, 0, 0);
          m.position.copy(home.current);
          m.rotation.set(0, 0, 0);
        }, resetDelay);
      }
    }
  });

  return (
    <group>
      <mesh ref={mesh} position={home.current} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#ffffff" metalness={0.16} roughness={0.35} />
        <mesh position={[0, size[1] * 0.36, 0]}>
          <boxGeometry args={[size[0] * 0.86, size[1] * 0.22, size[2] * 0.86]} />
          <meshStandardMaterial color="#f3f4f6" metalness={0.12} roughness={0.28} />
        </mesh>
      </mesh>

      <Text
        position={[home.current.x, home.current.y + size[1] * 0.5 + 0.01, home.current.z + size[2] * 0.22]}
        fontSize={0.12}
        color="#111827"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
