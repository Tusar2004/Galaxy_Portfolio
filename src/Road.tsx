// src/Road.tsx
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Road({ 
  aRadius, 
  bRadius, 
  aIndex, 
  bIndex,
  mode = "default" 
}: { 
  aRadius: number; 
  bRadius: number; 
  aIndex: number; 
  bIndex: number;
  mode?: "default" | "car" | "rocket" | "walk";
}) {
  const lineRef = useRef<THREE.Line | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Different colors based on mode
  const roadColors = {
    default: "#48e5ff",
    car: "#ff6b35",
    rocket: "#8b5cf6",
    walk: "#10b981"
  };

  const color = roadColors[mode];

  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        linewidth: 2,
      }),
    [color]
  );

  const geom = useMemo(() => new THREE.BufferGeometry(), []);

  // Particles along the road
  const particleData = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const roadColor = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      colors[i * 3] = roadColor.r;
      colors[i * 3 + 1] = roadColor.g;
      colors[i * 3 + 2] = roadColor.b;
      
      sizes[i] = Math.random() * 0.15 + 0.05;
    }
    
    return { positions, colors, sizes };
  }, [color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const aAngle = t * 0.2 + aIndex * 0.7;
    const bAngle = t * -0.12 + bIndex * 1.1;
    
    const aPos = new THREE.Vector3(
      Math.cos(aAngle) * aRadius,
      0,
      Math.sin(aAngle) * aRadius * 0.72
    );
    const bPos = new THREE.Vector3(
      Math.cos(bAngle) * bRadius,
      0,
      Math.sin(bAngle) * bRadius * 0.72
    );
    
    // Elevated control point for arc
    const control = aPos.clone().lerp(bPos, 0.5).add(new THREE.Vector3(0, 3.5, 0));
    
    const curve = new THREE.CatmullRomCurve3([aPos, control, bPos]);
    const pts = curve.getPoints(299);
    const arr = geom.attributes.position?.array as Float32Array;
    
    if (arr) {
      for (let i = 0; i < pts.length; i++) {
        arr[i * 3 + 0] = pts[i].x;
        arr[i * 3 + 1] = pts[i].y;
        arr[i * 3 + 2] = pts[i].z;
      }
      geom.attributes.position.needsUpdate = true;
    } else {
      const positions = new Float32Array(300 * 3);
      for (let i = 0; i < pts.length; i++) {
        positions[i * 3 + 0] = pts[i].x;
        positions[i * 3 + 1] = pts[i].y;
        positions[i * 3 + 2] = pts[i].z;
      }
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    }

    // Update particles along the road
    if (particlesRef.current && pts.length > 0) {
      const particlePositions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const count = particlePositions.length / 3;
      
      for (let i = 0; i < count; i++) {
        const progress = (i / count + t * 0.1) % 1;
        const index = Math.floor(progress * (pts.length - 1));
        const point = pts[index];
        
        particlePositions[i * 3] = point.x;
        particlePositions[i * 3 + 1] = point.y + Math.sin(t * 2 + i) * 0.1;
        particlePositions[i * 3 + 2] = point.z;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  React.useEffect(() => {
    if (!lineRef.current) {
      lineRef.current = new THREE.Line(geom, mat);
    }
  }, [geom, mat]);

  return (
    <group>
      {/* Main road line */}
      <primitive object={lineRef.current} />
      
      {/* Glowing tube effect */}
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(0, 0, 0)
          ]),
          64,
          0.05,
          8,
          false
        ]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Particles flowing along road */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[particleData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Pulsing light along the road */}
      <pointLight
        color={color}
        intensity={0.5}
        distance={5}
        position={[0, 1, 0]}
      />
    </group>
  );
}