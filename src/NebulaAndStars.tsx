import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NebulaAndStars() {
  const starsRef = useRef<THREE.Points | null>(null);
  const distantStarsRef = useRef<THREE.Points | null>(null);
  const twinkleStarsRef = useRef<THREE.Points | null>(null);
  const nebulaRefs = useRef<THREE.Mesh[]>([]);
  const dustCloudsRef = useRef<THREE.Points | null>(null);

  const starCount = 3500;
  const distantStarCount = 2000;
  const twinkleStarCount = 800;
  const dustParticleCount = 1500;

  // Main star field with varied distribution
  const starData = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 140;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4 + (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color variety (white, blue-white, yellow-white)
      const colorType = Math.random();
      if (colorType < 0.7) {
        // White stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else if (colorType < 0.85) {
        // Blue-white stars
        colors[i * 3] = 0.7;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Yellow-white stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.8;
      }

      sizes[i] = Math.random() * 0.8 + 0.3;
    }

    return { positions, colors, sizes };
  }, []);

  // Distant background stars
  const distantStarData = useMemo(() => {
    const positions = new Float32Array(distantStarCount * 3);
    const colors = new Float32Array(distantStarCount * 3);

    for (let i = 0; i < distantStarCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 180 + Math.random() * 80;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
      positions[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3] = 0.6 + Math.random() * 0.4;
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }

    return { positions, colors };
  }, []);

  // Twinkling stars with animation data
  const twinkleStarData = useMemo(() => {
    const positions = new Float32Array(twinkleStarCount * 3);
    const colors = new Float32Array(twinkleStarCount * 3);
    const phases = new Float32Array(twinkleStarCount);

    for (let i = 0; i < twinkleStarCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 100;
      
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      // Bright colored stars
      const hue = Math.random();
      if (hue < 0.3) {
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1.0;
      } else if (hue < 0.6) {
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, phases };
  }, []);

  // Dust cloud particles
  const dustData = useMemo(() => {
    const positions = new Float32Array(dustParticleCount * 3);
    const colors = new Float32Array(dustParticleCount * 3);
    const sizes = new Float32Array(dustParticleCount);

    for (let i = 0; i < dustParticleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 80;
      
      positions[i * 3] = Math.cos(theta) * r + (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = Math.sin(theta) * r + (Math.random() - 0.5) * 30;

      // Dust colors (purple, cyan, pink tints)
      const dustType = Math.random();
      if (dustType < 0.4) {
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.8;
      } else if (dustType < 0.7) {
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 0.7;
      } else {
        colors[i * 3] = 0.2;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.8;
      }

      sizes[i] = Math.random() * 1.5 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Animate main stars - subtle pulsing
    if (starsRef.current) {
      const mat = starsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.85 + Math.sin(t * 0.5) * 0.08;
    }

    // Animate distant stars - very slow rotation
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y = t * 0.005;
      const mat = distantStarsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.4 + Math.sin(t * 0.3) * 0.05;
    }

    // Animate twinkling stars - individual phases
    if (twinkleStarsRef.current) {
      const geometry = twinkleStarsRef.current.geometry;
      const sizes = geometry.attributes.size as THREE.BufferAttribute;
      
      for (let i = 0; i < twinkleStarCount; i++) {
        const phase = twinkleStarData.phases[i];
        sizes.array[i] = 0.8 + Math.sin(t * 3 + phase) * 0.6;
      }
      sizes.needsUpdate = true;
    }

    // Animate dust clouds - slow drift
    if (dustCloudsRef.current) {
      dustCloudsRef.current.rotation.y = t * 0.01;
      const mat = dustCloudsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.4) * 0.05;
    }

    // Animate nebula planes - wave motion
    nebulaRefs.current.forEach((nebula, i) => {
      if (!nebula) return;
      const mat = nebula.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.08 + Math.sin(t * 0.3 + i * 0.5) * 0.03) * (i % 2 === 0 ? 1 : 0.8);
      nebula.rotation.z = Math.sin(t * 0.1 + i) * 0.05;
      nebula.position.y += Math.sin(t + i) * 0.002;
    });
  });

  return (
    <group>
      {/* ============================================
          MAIN STAR FIELD
          ============================================ */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[starData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.7}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ============================================
          DISTANT BACKGROUND STARS
          ============================================ */}
      <points ref={distantStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[distantStarData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[distantStarData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.4}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ============================================
          TWINKLING STARS
          ============================================ */}
      <points ref={twinkleStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[twinkleStarData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[twinkleStarData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[new Float32Array(twinkleStarCount).fill(1.0), 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ============================================
          DUST CLOUDS
          ============================================ */}
      <points ref={dustCloudsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[dustData.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[dustData.sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.0}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* ============================================
          NEBULA CLOUDS - Multiple Layers
          ============================================ */}
      
      {/* Purple nebula - left side */}
      <mesh
        ref={(el) => (nebulaRefs.current[0] = el!)}
        position={[-45, -8, -60]}
        rotation={[0.2, 0.15, 0]}
      >
        <planeGeometry args={[250, 150]} />
        <meshBasicMaterial
          color="#4a1a5c"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cyan nebula - right side */}
      <mesh
        ref={(el) => (nebulaRefs.current[1] = el!)}
        position={[50, 5, -50]}
        rotation={[0.1, -0.25, 0]}
      >
        <planeGeometry args={[220, 130]} />
        <meshBasicMaterial
          color="#0a4a5c"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pink nebula - top */}
      <mesh
        ref={(el) => (nebulaRefs.current[2] = el!)}
        position={[10, 35, -70]}
        rotation={[0.4, 0, 0.1]}
      >
        <planeGeometry args={[180, 120]} />
        <meshBasicMaterial
          color="#5c1a3a"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Green nebula - bottom left */}
      <mesh
        ref={(el) => (nebulaRefs.current[3] = el!)}
        position={[-30, -20, -45]}
        rotation={[-0.3, 0.2, 0]}
      >
        <planeGeometry args={[200, 110]} />
        <meshBasicMaterial
          color="#1a3a2a"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Blue nebula - center back */}
      <mesh
        ref={(el) => (nebulaRefs.current[4] = el!)}
        position={[0, 0, -90]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[280, 180]} />
        <meshBasicMaterial
          color="#0a1a3a"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orange nebula - right bottom */}
      <mesh
        ref={(el) => (nebulaRefs.current[5] = el!)}
        position={[40, -15, -55]}
        rotation={[-0.2, -0.3, 0.1]}
      >
        <planeGeometry args={[160, 100]} />
        <meshBasicMaterial
          color="#3a2a1a"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ============================================
          VOLUMETRIC NEBULA SPHERES (Depth Effect)
          ============================================ */}
      
      {[
        { pos: [-60, 10, -80], scale: 25, color: "#8b5cf6", opacity: 0.04 },
        { pos: [70, -10, -100], scale: 30, color: "#3b82f6", opacity: 0.03 },
        { pos: [-40, -25, -70], scale: 20, color: "#ec4899", opacity: 0.035 },
        { pos: [30, 30, -90], scale: 22, color: "#06b6d4", opacity: 0.03 },
      ].map((nebula, i) => (
        <mesh key={`sphere-nebula-${i}`} position={nebula.pos as [number, number, number]}>
          <sphereGeometry args={[nebula.scale, 32, 32]} />
          <meshBasicMaterial
            color={nebula.color}
            transparent
            opacity={nebula.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* ============================================
          STAR CLUSTERS (Concentrated Areas)
          ============================================ */}
      
      {[
        { pos: [40, 15, -60], count: 150, radius: 8, color: "#60a5fa" },
        { pos: [-50, -10, -70], count: 120, radius: 6, color: "#a78bfa" },
        { pos: [25, 25, -80], count: 100, radius: 5, color: "#34d399" },
      ].map((cluster, clusterIndex) => {
        const clusterPositions = new Float32Array(cluster.count * 3);
        for (let i = 0; i < cluster.count; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = Math.random() * cluster.radius;
          
          clusterPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          clusterPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          clusterPositions[i * 3 + 2] = r * Math.cos(phi);
        }

        return (
          <points key={`cluster-${clusterIndex}`} position={cluster.pos as [number, number, number]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[clusterPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.5}
              color={cluster.color}
              sizeAttenuation
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        );
      })}
    </group>
  );
}