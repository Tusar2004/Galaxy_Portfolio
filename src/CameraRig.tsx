// src/CameraRig.tsx
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  followTargetName?: string;
  selectedPlanet?: string | null;
  introDuration?: number;
}

export default function CameraRig({
  followTargetName = "player-vehicle",
  selectedPlanet = null,
  introDuration = 4,
}: CameraRigProps) {
  const { camera, scene } = useThree();

  // Camera modes with enhanced states
  const mode = useRef<"intro" | "follow" | "zoom" | "inside" | "dramatic-zoom">("intro");
  
  // Animation timers
  const tIntro = useRef(0);
  const zoomT = useRef(0);
  const shakeTime = useRef(0);
  
  // Camera state management
  const lockedRef = useRef(false);
  const prevFollowPos = useRef(new THREE.Vector3());
  const cameraVelocity = useRef(new THREE.Vector3());
  
  // Smooth zoom parameters
  const zoomStartPos = useRef(new THREE.Vector3());
  const zoomStartLookAt = useRef(new THREE.Vector3());
  
  // FOV animation
  const targetFOV = useRef(60);
  const currentFOV = useRef(60);

  // Parallax shake effect for dynamic movement
  const [shake] = useState(() => ({
    offset: new THREE.Vector3(),
    intensity: 0,
  }));

  function getObjectByNameSafe(name?: string | null) {
    if (!name) return undefined;
    try {
      return scene.getObjectByName(name) as THREE.Object3D | undefined;
    } catch {
      return undefined;
    }
  }

  // Enhanced zoom trigger with dramatic camera work
  useEffect(() => {
    if (selectedPlanet) {
      // Store current camera state for smooth transition
      zoomStartPos.current.copy(camera.position);
      const followObj = getObjectByNameSafe(followTargetName);
      if (followObj) {
        zoomStartLookAt.current.copy(followObj.position);
      } else {
        zoomStartLookAt.current.set(0, 0, 0);
      }
      
      mode.current = "dramatic-zoom";
      zoomT.current = 0;
      targetFOV.current = 50; // Slight zoom in
      
      if (!lockedRef.current) {
        lockedRef.current = true;
        window.dispatchEvent(new CustomEvent("camera-lock", { detail: true }));
      }
    } else {
      mode.current = "follow";
      targetFOV.current = 60; // Reset FOV
      
      if (lockedRef.current) {
        lockedRef.current = false;
        window.dispatchEvent(new CustomEvent("camera-lock", { detail: false }));
      }
    }
  }, [selectedPlanet, camera, followTargetName]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033);
    const followObj = getObjectByNameSafe(followTargetName);
    const now = state.clock.elapsedTime;

    // Smooth FOV transitions
    currentFOV.current = THREE.MathUtils.lerp(currentFOV.current, targetFOV.current, dt * 5);
    if ("fov" in camera) {
      (camera as any).fov = currentFOV.current;
      camera.updateProjectionMatrix();
    }

    // Update shake effect
    if (shake.intensity > 0) {
      shakeTime.current += dt * 10;
      shake.offset.set(
        Math.sin(shakeTime.current) * shake.intensity,
        Math.cos(shakeTime.current * 1.3) * shake.intensity,
        Math.sin(shakeTime.current * 0.8) * shake.intensity * 0.5
      );
      shake.intensity *= 0.95; // Decay
    } else {
      shake.offset.set(0, 0, 0);
    }

    /* ============================================
       INTRO MODE - Cinematic Entry
       ============================================ */
    if (mode.current === "intro") {
      tIntro.current = Math.min(1, tIntro.current + dt / Math.max(0.01, introDuration));
      const t = easeInOutCubic(tIntro.current);
      
      // Dramatic spiral entry
      const spiralAngle = (1 - t) * Math.PI * 2;
      const spiralRadius = 30 * (1 - t);
      const height = 25 * (1 - t) + 3;
      
      const targetPos = new THREE.Vector3(
        Math.cos(spiralAngle) * spiralRadius,
        height,
        Math.sin(spiralAngle) * spiralRadius + 14 * t
      );
      
      camera.position.lerp(targetPos, dt * 3.5);
      
      // Look at center with slight anticipation
      const lookTarget = new THREE.Vector3(0, t * -1, 0);
      camera.lookAt(lookTarget);
      
      // Add subtle FOV animation
      targetFOV.current = 70 - t * 10; // 70 -> 60
      
      if (t >= 1) {
        mode.current = "follow";
        targetFOV.current = 60;
      }
      return;
    }

    /* ============================================
       FOLLOW MODE - Dynamic Following
       ============================================ */
    if (mode.current === "follow") {
      if (followObj) {
        // Calculate velocity for dynamic camera offset
        const currentPos = followObj.position.clone();
        const velocity = currentPos.clone().sub(prevFollowPos.current);
        prevFollowPos.current.copy(currentPos);
        
        // Smooth velocity for camera lag
        cameraVelocity.current.lerp(velocity, dt * 5);
        
        // Dynamic offset based on movement
        const baseOffset = new THREE.Vector3(0, 2.5, 8.5);
        const velocityOffset = cameraVelocity.current.clone().multiplyScalar(-15);
        velocityOffset.y = Math.abs(velocityOffset.y); // Keep height positive
        
        // Apply rotation to offset
        const rotatedOffset = baseOffset.clone().add(velocityOffset);
        rotatedOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), followObj.rotation.y || 0);
        
        // Add slight side offset based on rotation
        const sideOffset = Math.sin((followObj.rotation.y || 0)) * 0.8;
        rotatedOffset.x += sideOffset;
        
        const desired = followObj.position.clone().add(rotatedOffset).add(shake.offset);
        
        // Smooth camera movement with adaptive speed
        const smoothFactor = 3.5 + Math.min(cameraVelocity.current.length() * 2, 2);
        camera.position.lerp(desired, dt * smoothFactor);
        
        // Look ahead of the target
        const lookAheadTarget = followObj.position.clone().add(
          cameraVelocity.current.clone().multiplyScalar(8)
        );
        lookAheadTarget.y += 0.5;
        
        // Smooth look-at
        const currentLookAt = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(camera.quaternion)
          .add(camera.position);
        currentLookAt.lerp(lookAheadTarget, dt * 4);
        camera.lookAt(currentLookAt);
        
        // Dynamic FOV based on speed
        const speed = cameraVelocity.current.length();
        targetFOV.current = 60 + Math.min(speed * 50, 10); // Max +10 FOV
        
      } else {
        // Cinematic idle orbit when no target
        const orbitRadius = 22;
        const angle = now * 0.05;
        const heightWave = Math.sin(now * 0.3) * 2;
        
        const desired = new THREE.Vector3(
          Math.cos(angle) * orbitRadius,
          7 + heightWave,
          Math.sin(angle) * orbitRadius * 0.7
        );
        
        camera.position.lerp(desired, dt * 0.8);
        camera.lookAt(0, 1, 0);
        targetFOV.current = 60;
      }
      return;
    }

    /* ============================================
       DRAMATIC ZOOM MODE - Cinematic Transition
       ============================================ */
    if (mode.current === "dramatic-zoom" && selectedPlanet) {
      const planet = getObjectByNameSafe(selectedPlanet);
      if (!planet) return;
      
      zoomT.current = Math.min(1, zoomT.current + dt * 0.8);
      const t = easeInOutQuart(zoomT.current);
      
      // Calculate zoom path with arc
      const startPos = zoomStartPos.current;
      const endPos = planet.position.clone().add(new THREE.Vector3(0, 1.5, 3.5));
      
      // Add arc to the motion (up then down)
      const arcHeight = 5;
      const currentArc = Math.sin(t * Math.PI) * arcHeight;
      
      const targetPos = new THREE.Vector3(
        THREE.MathUtils.lerp(startPos.x, endPos.x, t),
        THREE.MathUtils.lerp(startPos.y, endPos.y, t) + currentArc,
        THREE.MathUtils.lerp(startPos.z, endPos.z, t)
      );
      
      camera.position.lerp(targetPos, dt * 4.5);
      
      // Smooth look-at transition
      const lookStart = zoomStartLookAt.current;
      const lookEnd = planet.position.clone();
      lookEnd.y += 0.3;
      
      const currentLookTarget = new THREE.Vector3(
        THREE.MathUtils.lerp(lookStart.x, lookEnd.x, t),
        THREE.MathUtils.lerp(lookStart.y, lookEnd.y, t),
        THREE.MathUtils.lerp(lookStart.z, lookEnd.z, t)
      );
      
      camera.lookAt(currentLookTarget);
      
      // Dynamic FOV during zoom
      targetFOV.current = THREE.MathUtils.lerp(60, 45, t);
      
      // Add slight camera shake during fast movement
      if (t > 0.2 && t < 0.8) {
        shake.intensity = 0.02 * Math.sin(t * Math.PI);
      }
      
      if (t >= 1) {
        mode.current = "inside";
        targetFOV.current = 50;
      }
      return;
    }

    /* ============================================
       INSIDE MODE - Planet Orbit
       ============================================ */
    if (mode.current === "inside" && selectedPlanet) {
      const planet = getObjectByNameSafe(selectedPlanet);
      if (!planet) return;
      
      // Smooth orbital motion with figure-8 pattern
      const angle = state.clock.elapsedTime * 0.15;
      const radius = 3.8;
      const heightOscillation = Math.sin(angle * 2) * 0.6;
      
      const orbitX = Math.cos(angle) * radius;
      const orbitZ = Math.sin(angle) * radius * 0.8; // Elliptical
      const orbitY = 1.4 + heightOscillation;
      
      const desired = new THREE.Vector3(
        planet.position.x + orbitX,
        planet.position.y + orbitY,
        planet.position.z + orbitZ
      ).add(shake.offset);
      
      camera.position.lerp(desired, dt * 2.8);
      
      // Look at planet center with slight offset
      const lookTarget = planet.position.clone();
      lookTarget.y += Math.sin(angle * 0.5) * 0.3;
      camera.lookAt(lookTarget);
      
      // Subtle FOV breathing
      targetFOV.current = 50 + Math.sin(now * 0.5) * 2;
      
      return;
    }
  });

  return null;
}

/* ============================================
   EASING FUNCTIONS
   ============================================ */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}