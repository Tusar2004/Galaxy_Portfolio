import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function OrbitTrail({ radius = 8, ellipseFactor = 0.75, color = "#0ea5e9" }: { radius?: number; ellipseFactor?: number; color?: string }) {
  const lineRef = useRef<THREE.Line | null>(null);

  const points = useMemo(() => {
    const p: THREE.Vector3[] = [];
    const seg = 128;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      p.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius * ellipseFactor));
    }
    return p;
  }, [radius, ellipseFactor]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.12 }), [color]);

  useFrame((state) => {
    const l = lineRef.current;
    if (!l) return;
    const a = 0.9 + Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    (mat as any).opacity = 0.12 * a;
  });

  const lineObj = useMemo(() => new THREE.Line(geometry, mat), [geometry, mat]);
  return <primitive object={lineObj} ref={lineRef as any} rotation={[-Math.PI / 2, 0, 0]} />;
}
