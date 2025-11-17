// src/SceneComponents.tsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import DirectionSign from "./ui/DirectionSign";

/* ============================================
   ENHANCED PLATFORM - Central Landing Area
   ============================================ */
export function EnhancedPlatform() {
  const platformRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Animated particles around platform
  const particleData = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3 + Math.random() * 3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Rotate entire platform slowly
    if (platformRef.current) {
      platformRef.current.rotation.y = t * 0.05;
    }
    
    // Animate rings with wave effect
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        const phase = t * 2 + i * 0.5;
        const scale = 1 + Math.sin(phase) * 0.05;
        ring.scale.setScalar(scale);
        
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.3 + Math.sin(phase) * 0.15;
      }
    });
    
    // Pulsing core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.1;
      coreRef.current.scale.setScalar(pulse);
      
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 3) * 0.2;
    }
    
    // Rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.2;
      
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] = Math.sin(t + i) * 0.3;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={platformRef} position={[0, -1.5, 0]}>
      {/* Main Platform Base */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[6, 6, 0.4, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          metalness={0.9}
          roughness={0.2}
          emissive="#0ea5e9"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Top Surface Detail */}
      <mesh position={[0, 0.21, 0]} receiveShadow>
        <cylinderGeometry args={[5.8, 5.8, 0.02, 64]} />
        <meshStandardMaterial
          color="#1e3a5f"
          metalness={0.8}
          roughness={0.3}
          emissive="#0ea5e9"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glowing Rings */}
      {[3, 4, 5, 5.5].map((radius, i) => (
        <mesh
          key={`ring-${i}`}
          ref={(el) => el && (ringsRef.current[i] = el)}
          position={[0, 0.22, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[radius - 0.03, radius + 0.03, 64]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Central Core Glow */}
      <mesh ref={coreRef} position={[0, 0.23, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 32]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Hexagon Pattern */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        return (
          <mesh key={`hex-${i}`} position={[x, 0.22, z]} rotation={[-Math.PI / 2, 0, angle]}>
            <circleGeometry args={[0.3, 6]} />
            <meshBasicMaterial
              color="#0ea5e9"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Tech Lines - Radial */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh
            key={`line-${i}`}
            position={[Math.cos(angle) * 3, 0.23, Math.sin(angle) * 3]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[0.05, 3]} />
            <meshBasicMaterial
              color="#0ea5e9"
              transparent
              opacity={0.25}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Corner Pillars with Lights */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
        const x = Math.cos(angle) * 5.5;
        const z = Math.sin(angle) * 5.5;
        return (
          <group key={`pillar-${i}`} position={[x, 0.5, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
              <meshStandardMaterial
                color="#0a1628"
                metalness={0.9}
                roughness={0.1}
                emissive="#0ea5e9"
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Top Light */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={0.8}
              />
            </mesh>
            
            <pointLight
              position={[0, 0.6, 0]}
              color="#00d4ff"
              intensity={0.5}
              distance={5}
            />
          </group>
        );
      })}

      {/* Floating Particles */}
      <points ref={particlesRef} position={[0, 0.3, 0]}>
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
          size={0.08}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Holographic Grid Floor */}
      <mesh position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12, 20, 20]} />
        <meshBasicMaterial
          color="#0ea5e9"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Under Glow Effect */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7, 64]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ============================================
   SPACE PARTICLES - Ambient Floating Dust
   ============================================ */
export function SpaceParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleData = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random position in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 80;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3 + (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Color variations
      const colorType = Math.random();
      const color = new THREE.Color();
      if (colorType < 0.4) {
        color.setHex(0x00d4ff); // Cyan
      } else if (colorType < 0.7) {
        color.setHex(0x8b5cf6); // Purple
      } else {
        color.setHex(0xffffff); // White
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.15 + 0.05;
      
      // Slow drift velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, colors, sizes, velocities };
  }, []);

  useFrame((_state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = particleData.velocities;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Drift motion
      positions[i] += velocities[i] * delta * 60;
      positions[i + 1] += velocities[i + 1] * delta * 60;
      positions[i + 2] += velocities[i + 2] * delta * 60;
      
      // Respawn if too far
      const distance = Math.sqrt(
        positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2
      );
      
      if (distance > 100) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 20;
        
        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
        positions[i + 2] = r * Math.cos(phi);
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotation for variety
    particlesRef.current.rotation.y += delta * 0.01;
  });

  return (
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
        size={0.12}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ============================================
   NEBULA CLOUDS - Volumetric Space Clouds
   ============================================ */
export function NebulaClouds() {
  const cloudRefs = useRef<THREE.Mesh[]>([]);
  
  const cloudData = [
    { position: [-40, 10, -60], scale: 30, color: "#8b5cf6", opacity: 0.08 },
    { position: [50, -5, -80], scale: 35, color: "#3b82f6", opacity: 0.06 },
    { position: [-30, -15, -50], scale: 25, color: "#ec4899", opacity: 0.07 },
    { position: [35, 25, -70], scale: 28, color: "#06b6d4", opacity: 0.06 },
    { position: [0, 30, -90], scale: 40, color: "#a78bfa", opacity: 0.05 },
    { position: [-60, 5, -45], scale: 22, color: "#f59e0b", opacity: 0.04 },
  ];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    cloudRefs.current.forEach((cloud, i) => {
      if (cloud) {
        // Slow rotation
        cloud.rotation.y = t * 0.02 + i * 0.3;
        cloud.rotation.z = Math.sin(t * 0.05 + i) * 0.1;
        
        // Pulsing effect
        const pulse = 1 + Math.sin(t * 0.3 + i * 0.5) * 0.08;
        cloud.scale.setScalar(cloudData[i].scale * pulse);
        
        // Opacity variation
        const mat = cloud.material as THREE.MeshBasicMaterial;
        mat.opacity = cloudData[i].opacity * (0.8 + Math.sin(t * 0.4 + i) * 0.2);
      }
    });
  });

  return (
    <group>
      {cloudData.map((cloud, i) => (
        <mesh
          key={`cloud-${i}`}
          ref={(el) => el && (cloudRefs.current[i] = el)}
          position={cloud.position as [number, number, number]}
        >
          <sphereGeometry args={[cloud.scale, 32, 32]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
      
      {/* Additional layered clouds for depth */}
      {cloudData.slice(0, 3).map((cloud, i) => {
        const pos = cloud.position as [number, number, number];
        return (
          <mesh
            key={`cloud-layer-${i}`}
            position={[pos[0] + 10, pos[1] - 5, pos[2] - 10]}
          >
            <sphereGeometry args={[cloud.scale * 0.7, 24, 24]} />
            <meshBasicMaterial
              color={cloud.color}
              transparent
              opacity={cloud.opacity * 0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ============================================
   DIRECTION SIGNS - Guide to Planets
   ============================================ */
export function DirectionSigns({ planets }: { planets: any[] }) {
  const signPositions = [
    { pos: [7, -1.3, -6], rot: -0.5, planetIndex: 0 },
    { pos: [-7, -1.3, -5], rot: 0.8, planetIndex: 1 },
    { pos: [10, -1.1, 3], rot: -1.2, planetIndex: 2 },
    { pos: [-9, -1.2, 4], rot: 1.5, planetIndex: 3 },
    { pos: [0, -1.3, 8], rot: 0, planetIndex: 4 },
  ];

  return (
    <group>
      {signPositions.map((sign, i) => {
        const planet = planets[sign.planetIndex];
        if (!planet) return null;
        
        return (
          <DirectionSign
            key={`sign-${i}`}
            label={`${planet.icon} ${planet.label}`}
            position={sign.pos as [number, number, number]}
            rotation={sign.rot}
            color={planet.color}
          />
        );
      })}
    </group>
  );
}

/* ============================================
   FLOATING ASTEROIDS - Space Debris
   ============================================ */
export function FloatingAsteroids({ count = 20 }: { count?: number }) {
  const asteroidRefs = useRef<THREE.Mesh[]>([]);
  
  const asteroidData = useMemo(() => {
    return Array.from({ length: count }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 25 + Math.random() * 60;
      
      return {
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          (Math.random() - 0.5) * 30,
          r * Math.cos(phi)
        ),
        scale: Math.random() * 0.8 + 0.3,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
        orbitSpeed: (Math.random() - 0.5) * 0.005,
        orbitRadius: r,
        orbitAngle: Math.random() * Math.PI * 2,
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    asteroidRefs.current.forEach((asteroid, i) => {
      if (!asteroid) return;
      
      const data = asteroidData[i];
      
      // Orbit motion
      data.orbitAngle += data.orbitSpeed * delta * 60;
      asteroid.position.x = Math.cos(data.orbitAngle) * data.orbitRadius;
      asteroid.position.z = Math.sin(data.orbitAngle) * data.orbitRadius;
      asteroid.position.y += Math.sin(t + i) * 0.001;
      
      // Rotation
      asteroid.rotation.x += data.rotationSpeed.x;
      asteroid.rotation.y += data.rotationSpeed.y;
      asteroid.rotation.z += data.rotationSpeed.z;
    });
  });

  return (
    <group>
      {asteroidData.map((data, i) => (
        <mesh
          key={`asteroid-${i}`}
          ref={(el) => el && (asteroidRefs.current[i] = el)}
          position={data.position}
          scale={data.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.9}
            metalness={0.1}
            emissive="#1a1a1a"
            emissiveIntensity={0.05}
          />
          
          {/* Glowing cracks */}
          <mesh scale={1.01}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial
              color="#0ea5e9"
              wireframe
              transparent
              opacity={0.15}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

/* ============================================
   AMBIENT ENERGY FIELD - Background Effect
   ============================================ */
export function AmbientEnergyField() {
  const fieldRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      fieldRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      
      const mat = fieldRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <mesh ref={fieldRef} position={[0, 0, 0]}>
      <sphereGeometry args={[70, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshBasicMaterial
        color="#0ea5e9"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
}