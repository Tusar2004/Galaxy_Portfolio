import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points } from "three";
import { useControls } from "./useControls";

export default function ThrusterParticles() {
  const pointsRef = useRef<Points | null>(null);
  const boost = useControls((s: any) => s.boost);
  const count = 40;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.08;
    positions[i * 3 + 1] = -1;
    positions[i * 3 + 2] = Math.random() * 0.22 + 0.05;
  }

  useFrame((_state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= delta * (boost ? 5 : 2);
      if (arr[i * 3 + 1] < -2) arr[i * 3 + 1] = -1;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, -0.7, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffae00" size={0.07} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}
