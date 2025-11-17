// src/hooks/useAchievementTracker.ts
import { useEffect, useRef } from "react";
import { useAchievementStore } from "../stores/achievementStore";

export function useAchievementTracker() {
  const { unlockAchievement, updateProgress, achievements } = useAchievementStore();
  
  // Track various metrics
  const metrics = useRef({
    visitedPlanets: new Set<string>(),
    boostCount: 0,
    boostTime: 0,
    lastBoostTime: 0,
    totalDistance: 0,
    lastPosition: { x: 0, y: 0, z: 0 },
    interiorTime: 0,
    photosTaken: 0,
    vehiclesUsed: new Set<string>(),
    secretsFound: new Set<string>(),
  });

  // First launch achievement
  useEffect(() => {
    const achievement = achievements.find((a) => a.id === "first_launch");
    if (!achievement?.unlocked) {
      setTimeout(() => unlockAchievement("first_launch"), 2000);
    }
  }, []);

  // Night owl achievement
  useEffect(() => {
    const hour = new Date().getHours();
    if ((hour >= 22 || hour < 6) && !achievements.find((a) => a.id === "night_owl")?.unlocked) {
      unlockAchievement("night_owl");
    }
  }, []);

  // Track planet visits
  const trackPlanetVisit = (planetName: string) => {
    if (!metrics.current.visitedPlanets.has(planetName)) {
      metrics.current.visitedPlanets.add(planetName);
      
      // First planet achievement
      if (metrics.current.visitedPlanets.size === 1) {
        unlockAchievement("planet_explorer");
      }
      
      // All planets achievement
      updateProgress("galaxy_traveler", metrics.current.visitedPlanets.size);
    }
  };

  // Track boost usage
  const trackBoost = (isBoosting: boolean) => {
    const now = Date.now();
    
    if (isBoosting) {
      if (now - metrics.current.lastBoostTime > 1000) {
        metrics.current.boostCount++;
        updateProgress("speed_demon", metrics.current.boostCount);
      }
      metrics.current.lastBoostTime = now;
      metrics.current.boostTime += 0.016; // Approximate frame time
      
      updateProgress("sonic_boom", Math.floor(metrics.current.boostTime));
    }
  };

  // Track distance traveled
  const trackDistance = (position: { x: number; y: number; z: number }) => {
    const last = metrics.current.lastPosition;
    const dx = position.x - last.x;
    const dy = position.y - last.y;
    const dz = position.z - last.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    metrics.current.totalDistance += distance;
    metrics.current.lastPosition = position;
    
    updateProgress("marathon_runner", Math.floor(metrics.current.totalDistance));
  };

  // Track interior time
  const trackInteriorTime = (isInInterior: boolean, deltaTime: number) => {
    if (isInInterior) {
      metrics.current.interiorTime += deltaTime;
      updateProgress("deep_diver", Math.floor(metrics.current.interiorTime));
    }
  };

  // Track vehicle usage
  const trackVehicle = (vehicleType: string) => {
    if (!metrics.current.vehiclesUsed.has(vehicleType)) {
      metrics.current.vehiclesUsed.add(vehicleType);
      updateProgress("vehicle_switcher", metrics.current.vehiclesUsed.size);
    }
  };

  // Track photos
  const trackPhoto = () => {
    metrics.current.photosTaken++;
    
    if (metrics.current.photosTaken === 1) {
      unlockAchievement("photographer");
    }
    
    updateProgress("influencer", metrics.current.photosTaken);
  };

  // Track secrets found
  const trackSecret = (secretId: string) => {
    if (!metrics.current.secretsFound.has(secretId)) {
      metrics.current.secretsFound.add(secretId);
      updateProgress("easter_egg_hunter", metrics.current.secretsFound.size);
      
      if (secretId === "secret_planet") {
        unlockAchievement("secret_planet");
      }
      
      if (secretId === "konami_code") {
        unlockAchievement("konami_master");
      }
    }
  };

  // Track customization
  const trackCustomization = () => {
    if (!achievements.find((a) => a.id === "customizer")?.unlocked) {
      unlockAchievement("customizer");
    }
  };

  return {
    trackPlanetVisit,
    trackBoost,
    trackDistance,
    trackInteriorTime,
    trackVehicle,
    trackPhoto,
    trackSecret,
    trackCustomization,
  };
}