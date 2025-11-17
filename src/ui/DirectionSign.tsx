import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DirectionSign({
  label = "PROJECTS",
  rotation = 0,
  position = [0, 0, 0] as [number, number, number],
  color = "#0f172a",
}: {
  label?: string;
  rotation?: number;
  position?: [number, number, number];
  color?: string;
}) {
  const pole = useRef<THREE.Mesh | null>(null);
  const sign = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (pole.current) {
      pole.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35 + position[0]) * 0.04;
    }
    if (sign.current) sign.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45 + position[2]) * 0.06;
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh ref={pole} position={[0, 0.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 10]} />
        <meshStandardMaterial color="#6b7280" metalness={0.25} roughness={0.6} />
      </mesh>

      <mesh ref={sign} position={[0, 1.35, -0.26]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.18, 0.14]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Text position={[0, 1.37, -0.12]} fontSize={0.12} color={color} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}
