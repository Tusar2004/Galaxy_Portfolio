import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useControls } from "./useControls";

export default function RocketFlame() {
  const ref = useRef<Mesh | null>(null);
  const boost = useControls((s: any) => s.boost);

  useFrame((state) => {
    if (!ref.current) return;
    const flameScale = boost ? 1.9 : 1.1;
    const pulse = Math.sin(state.clock.elapsedTime * 40) * 0.18;
    const finalVal = flameScale + pulse;
    ref.current.scale.set(1, finalVal, 1);
    (ref.current.material as any).emissiveIntensity = boost ? 3 : 1.2;
  });

  return (
    <mesh ref={ref} position={[0, -0.9, 0]}>
      <coneGeometry args={[0.12, 0.38, 24]} />
      <meshStandardMaterial color="#ffa600" emissive="#ff3d00" emissiveIntensity={1.2} transparent opacity={0.9} />
    </mesh>
  );
}
