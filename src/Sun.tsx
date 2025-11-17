import React from "react";
import * as THREE from "three";

export default function Sun() {
  return (
    <>
      {/* Main sun body */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      
      {/* Sun glow/corona */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}