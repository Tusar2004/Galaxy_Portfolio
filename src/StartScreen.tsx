import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const SpacePortfolio = () => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(0, 250, 400);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced Starfield
    const createStarfield = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 15000;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 5000;
        positions[i3 + 1] = (Math.random() - 0.5) * 5000;
        positions[i3 + 2] = (Math.random() - 0.5) * 5000;

        const color = new THREE.Color();
        const colorChoice = Math.random();
        if (colorChoice < 0.6) {
          color.setHSL(0, 0, 1);
        } else if (colorChoice < 0.8) {
          color.setHSL(0.6, 0.5, 0.95);
        } else if (colorChoice < 0.9) {
          color.setHSL(0.1, 0.7, 0.9);
        } else {
          color.setHSL(0.55, 0.8, 0.85);
        }
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 1;
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const starMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      });

      return new THREE.Points(starGeometry, starMaterial);
    };

    const stars = createStarfield();
    scene.add(stars);

    // Nebula
    const createNebula = () => {
      const nebulaGroup = new THREE.Group();
      const colors = [0x4a0e4e, 0x1a0a3e, 0x0a1a2e, 0x2a1a4e];
      
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(400, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.05,
          side: THREE.BackSide
        });
        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.set(
          (Math.random() - 0.5) * 1500,
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 1500
        );
        nebulaGroup.add(nebula);
      }
      
      return nebulaGroup;
    };

    const nebula = createNebula();
    scene.add(nebula);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3, 2000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Enhanced Sun with corona
    const createSun = () => {
      const sunGroup = new THREE.Group();
      
      // Main sun body
      const sunGeometry = new THREE.SphereGeometry(35, 64, 64);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xfdb813,
        emissive: 0xfdb813,
        emissiveIntensity: 1
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sunGroup.add(sun);

      // Multiple glow layers for corona effect
      const glowLayers = [
        { size: 40, color: 0xffaa00, opacity: 0.4 },
        { size: 46, color: 0xff8800, opacity: 0.3 },
        { size: 53, color: 0xff6600, opacity: 0.2 },
        { size: 60, color: 0xff4400, opacity: 0.1 }
      ];

      glowLayers.forEach(layer => {
        const glowGeometry = new THREE.SphereGeometry(layer.size, 64, 64);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sunGroup.add(glow);
      });

      return sunGroup;
    };

    const sunGroup = createSun();
    scene.add(sunGroup);

    // Create realistic planet texture
    const createPlanetTexture = (color, hasAtmosphere = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Base color
      ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add surface details
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 30 + 5;
        const darkness = Math.random() * 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
        ctx.fill();
      }
      
      // Add bright spots (minerals/ice)
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 10 + 2;
        const brightness = Math.random() * 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    // Planet data with realistic details
    const planetsData = [
      { name: 'Mercury', radius: 4, distance: 60, color: 0x8c7853, speed: 0.04, tilt: 0.02, hasRings: false },
      { name: 'Venus', radius: 6, distance: 85, color: 0xffc649, speed: 0.03, tilt: 0.03, hasRings: false },
      { name: 'Earth', radius: 7, distance: 115, color: 0x4a90e2, speed: 0.025, tilt: 0.025, hasRings: false },
      { name: 'Mars', radius: 5, distance: 145, color: 0xe27b58, speed: 0.02, tilt: 0.028, hasRings: false },
      { name: 'Jupiter', radius: 20, distance: 220, color: 0xc88b3a, speed: 0.012, tilt: 0.015, hasRings: false },
      { name: 'Saturn', radius: 17, distance: 300, color: 0xfad5a5, speed: 0.009, tilt: 0.025, hasRings: true },
      { name: 'Uranus', radius: 12, distance: 380, color: 0x4fd0e7, speed: 0.006, tilt: 0.022, hasRings: true },
      { name: 'Neptune', radius: 11, distance: 450, color: 0x4166f5, speed: 0.005, tilt: 0.018, hasRings: false }
    ];

    const planets = [];
    const orbitLines = [];

    planetsData.forEach((data, index) => {
      // Create 3D orbit visualization
      const orbitGeometry = new THREE.TorusGeometry(data.distance, 0.3, 16, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const orbit3D = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit3D.rotation.x = Math.PI / 2;
      orbit3D.rotation.y = data.tilt * 5;
      scene.add(orbit3D);
      orbitLines.push(orbit3D);

      // Create planet with texture
      const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
      const texture = createPlanetTexture(data.color);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        metalness: 0.2,
        emissive: data.color,
        emissiveIntensity: 0.1
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.castShadow = true;
      planet.receiveShadow = true;

      // Add atmosphere for Earth, Venus, Uranus, Neptune
      if (index === 1 || index === 2 || index === 6 || index === 7) {
        const atmoGeometry = new THREE.SphereGeometry(data.radius * 1.1, 64, 64);
        const atmoMaterial = new THREE.MeshBasicMaterial({
          color: index === 2 ? 0x6ab7ff : data.color,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
        planet.add(atmosphere);
      }

      // Saturn and Uranus rings
      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          data.radius * 1.5, 
          data.radius * 2.5, 
          64
        );
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: index === 5 ? 0xc9b582 : 0x88ccdd,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
          roughness: 0.9
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
      }

      planets.push({
        mesh: planet,
        distance: data.distance,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2,
        tilt: data.tilt,
        rotationSpeed: 0.005 + Math.random() * 0.01
      });
      
      scene.add(planet);
    });

    // Enhanced Asteroid Belt
    const asteroidGroup = new THREE.Group();
    for (let i = 0; i < 1200; i++) {
      const size = Math.random() * 0.8 + 0.3;
      const geometry = new THREE.DodecahedronGeometry(size, 0);
      const material = new THREE.MeshStandardMaterial({
        color: 0x666666,
        roughness: 1,
        metalness: 0.3
      });
      const asteroid = new THREE.Mesh(geometry, material);
      
      const distance = 170 + Math.random() * 35;
      const angle = Math.random() * Math.PI * 2;
      asteroid.position.set(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 12,
        Math.sin(angle) * distance
      );
      asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      asteroidGroup.add(asteroid);
    }
    scene.add(asteroidGroup);

    // Advanced Spaceship
    const createAdvancedSpaceship = () => {
      const spaceshipGroup = new THREE.Group();
      
      // Main body - sleek design
      const bodyGeometry = new THREE.CylinderGeometry(5, 5, 16, 32);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        metalness: 0.9,
        roughness: 0.1
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      spaceshipGroup.add(body);
      
      // Nose cone
      const noseGeometry = new THREE.ConeGeometry(5, 8, 32);
      const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
      nose.rotation.z = -Math.PI / 2;
      nose.position.x = 12;
      nose.castShadow = true;
      spaceshipGroup.add(nose);
      
      // Back end
      const backGeometry = new THREE.ConeGeometry(5, 4, 32);
      const back = new THREE.Mesh(backGeometry, bodyMaterial);
      back.rotation.z = Math.PI / 2;
      back.position.x = -8;
      spaceshipGroup.add(back);

      // Orange accent bands
      for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(5.2, 0.5, 16, 32);
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: 0xff8c00,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0xff8c00,
          emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = -4 + i * 5;
        spaceshipGroup.add(ring);
      }

      // Cockpit window - large curved
      const windowGeometry = new THREE.SphereGeometry(4.5, 32, 32, 0, Math.PI * 0.6);
      const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ddff,
        transparent: true,
        opacity: 0.7,
        metalness: 0.1,
        roughness: 0,
        transmission: 0.9,
        thickness: 0.5
      });
      const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
      window1.rotation.y = -Math.PI / 2;
      window1.position.set(8, 0, 0);
      spaceshipGroup.add(window1);

      // Side windows
      for (let side of [-1, 1]) {
        const sideWindowGeometry = new THREE.CircleGeometry(1.5, 32);
        const sideWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        sideWindow.position.set(2, 0, side * 5.2);
        sideWindow.rotation.y = side * Math.PI / 2;
        spaceshipGroup.add(sideWindow);
      }

      // Engine exhausts - triple
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const radius = 3;
        
        const engineGeometry = new THREE.CylinderGeometry(1.2, 1.8, 4, 16);
        const engineMaterial = new THREE.MeshStandardMaterial({
          color: 0x333333,
          metalness: 1,
          roughness: 0.3
        });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.rotation.z = Math.PI / 2;
        engine.position.set(
          -10,
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );
        spaceshipGroup.add(engine);

        // Engine glow
        const glowGeometry = new THREE.CylinderGeometry(1.5, 2.5, 3, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x00d9ff,
          transparent: true,
          opacity: 0.8
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.z = Math.PI / 2;
        glow.position.set(
          -11.5,
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );
        spaceshipGroup.add(glow);

        // Engine light
        const engineLight = new THREE.PointLight(0x00d9ff, 2, 30);
        engineLight.position.set(
          -12,
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );
        spaceshipGroup.add(engineLight);
      }

      // Wings
      for (let side of [-1, 1]) {
        const wingGeometry = new THREE.BoxGeometry(6, 0.5, 12);
        const wingMaterial = new THREE.MeshStandardMaterial({
          color: 0xdddddd,
          metalness: 0.8,
          roughness: 0.2
        });
        const wing = new THREE.Mesh(wingGeometry, wingMaterial);
        wing.position.set(-2, 0, side * 8);
        wing.rotation.y = side * 0.2;
        wing.castShadow = true;
        spaceshipGroup.add(wing);

        // Wing tip lights
        const tipLightGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const tipLightMaterial = new THREE.MeshBasicMaterial({
          color: side === 1 ? 0x00ff00 : 0xff0000,
          emissive: side === 1 ? 0x00ff00 : 0xff0000
        });
        const tipLight = new THREE.Mesh(tipLightGeometry, tipLightMaterial);
        tipLight.position.set(-2, 0, side * 14);
        spaceshipGroup.add(tipLight);
      }

      // Communication antenna
      const antennaGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
      const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1
      });
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(0, 10, 0);
      spaceshipGroup.add(antenna);

      // Satellite dish
      const dishGeometry = new THREE.CylinderGeometry(3, 2, 0.8, 32);
      const dishMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.8,
        roughness: 0.2
      });
      const dish = new THREE.Mesh(dishGeometry, dishMaterial);
      dish.position.set(0, 14, 0);
      dish.rotation.x = Math.PI * 0.2;
      spaceshipGroup.add(dish);

      // Blinking red light on antenna
      const redLightGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const redLightMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        emissive: 0xff0000
      });
      const redLight = new THREE.Mesh(redLightGeometry, redLightMaterial);
      redLight.position.set(0, 15.5, 0);
      spaceshipGroup.add(redLight);

      const redLightPoint = new THREE.PointLight(0xff0000, 1, 20);
      redLightPoint.position.set(0, 15.5, 0);
      spaceshipGroup.add(redLightPoint);

      return spaceshipGroup;
    };

    const spaceship = createAdvancedSpaceship();
    spaceship.position.set(-300, 80, 200);
    spaceship.rotation.y = Math.PI / 4;
    spaceship.scale.set(1.5, 1.5, 1.5);
    scene.add(spaceship);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate sun group
      sunGroup.rotation.y += 0.001;
      sunGroup.children.forEach((child, i) => {
        if (i > 0) {
          child.rotation.y -= 0.0005 * i;
        }
      });

      // Animate planets in 3D orbital motion
      planets.forEach((planet, index) => {
        planet.angle += planet.speed * 0.01;
        
        // 3D orbital path
        const orbitTilt = Math.sin(planet.angle) * planet.tilt * 10;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.position.y = Math.sin(planet.angle * 2) * planet.tilt * 15;
        
        // Rotate planet on its axis
        planet.mesh.rotation.y += planet.rotationSpeed;
        
        // Tilt planet
        planet.mesh.rotation.z = planet.tilt * 2;
      });

      // Animate orbit lines
      orbitLines.forEach((orbit, i) => {
        orbit.rotation.z += 0.0001 * (i + 1);
      });

      // Rotate asteroid belt
      asteroidGroup.rotation.y += 0.0003;
      asteroidGroup.children.forEach(asteroid => {
        asteroid.rotation.x += 0.001;
        asteroid.rotation.y += 0.002;
      });

      // Animate spaceship
      spaceship.position.x += 0.8;
      spaceship.position.y += Math.sin(time * 0.5) * 0.15;
      spaceship.position.z += Math.cos(time * 0.3) * 0.1;
      spaceship.rotation.z = Math.sin(time * 0.5) * 0.05;
      spaceship.rotation.x = Math.sin(time * 0.3) * 0.03;
      
      if (spaceship.position.x > 500) {
        spaceship.position.set(-500, 80, 200);
      }

      // Engine glow pulse
      spaceship.children.forEach(child => {
        if (child.material && child.material.color && 
            child.material.color.getHex() === 0x00d9ff) {
          const pulse = 0.5 + Math.sin(time * 5) * 0.5;
          child.material.opacity = pulse;
        }
      });

      // Blinking antenna light
      const blinkSpeed = Math.sin(time * 3);
      if (spaceship.children.length > 0) {
        spaceship.children.forEach(child => {
          if (child instanceof THREE.PointLight && child.color.getHex() === 0xff0000) {
            child.intensity = blinkSpeed > 0 ? 1 : 0;
          }
        });
      }

      // Rotate stars slowly
      stars.rotation.y += 0.00005;
      stars.rotation.x += 0.00002;

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.05) * 30;
      camera.position.y = 250 + Math.cos(time * 0.08) * 20;
      camera.position.z = 400 + Math.sin(time * 0.06) * 30;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    // Simulate loading
    const loadingInterval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-95 z-10">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-40 h-40 mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                <div className="absolute inset-6 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" style={{ animationDuration: '2s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 tracking-wider">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  INITIALIZING SOLAR SYSTEM
                </span>
              </h1>
              <div className="w-80 h-3 bg-gray-800 rounded-full mx-auto overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 shadow-lg"
                  style={{ width: `${loadProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-300 mt-6 text-xl font-semibold">{loadProgress}%</p>
              <p className="text-gray-400 mt-2 text-sm">Loading 3D Solar System...</p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
            <h1 className="text-7xl font-bold mb-3 tracking-wider">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                SPACE PORTFOLIO
              </span>
            </h1>
            <p className="text-2xl text-blue-300 font-light">Explore the Universe of Creativity</p>
          </div>
          
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <button className="px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-bold rounded-full hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all transform hover:scale-110 pointer-events-auto shadow-2xl shadow-purple-500/50 border-2 border-white/20">
              🚀 Enter Portfolio
            </button>
          </div>

          <div className="absolute top-1/2 right-12 transform -translate-y-1/2 text-right text-white space-y-4">
            <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
              <p className="text-gray-300 text-sm mb-1">Planets Orbiting</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">8</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
              <p className="text-gray-300 text-sm mb-1">Asteroids</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">1200+</p>
            </div>
            <div className="bg-gradient-to-br from-pink-900/80 to-blue-900/80 px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
              <p className="text-gray-300 text-sm mb-1">Stars</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">15K+</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-900/80 to-blue-900/80 px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 shadow-xl">
              <p className="text-gray-300 text-sm mb-1">Spacecraft</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Active</p>
            </div>
          </div>

          <div className="absolute bottom-12 left-12 text-white space-y-2">
            <div className="bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <p className="text-xs text-gray-400">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-semibold text-green-400">All Systems Operational</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacePortfolio; 