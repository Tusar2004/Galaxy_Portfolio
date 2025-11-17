import React, { useState, useEffect, useRef } from 'react';
import './ModeSelect.css';

interface ModeData {
  id: 'car' | 'rocket' | 'walk';
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  glow: string;
  stats: { label: string; value: string }[];
  icon3D: string;
}

export default function ModeSelect({ onSelect }: { onSelect: (mode: 'car' | 'rocket' | 'walk') => void }) {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Initialize particles and audio
  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 8,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      color: ['#60a5fa', '#a78bfa', '#34d399'][Math.floor(Math.random() * 3)],
    }));
    setParticles(newParticles);

    // Preload hover sounds
    ['car', 'rocket', 'walk'].forEach(mode => {
      try {
        const audio = new Audio(`/hover-${mode}.mp3`);
        audio.volume = 0.3;
        audio.load();
        audioRef.current[mode] = audio;
      } catch (e) {
        console.log(`Audio for ${mode} not loaded`);
      }
    });

    // Show details after initial animation
    setTimeout(() => setShowDetails(true), 800);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        color: ['#60a5fa', '#a78bfa', '#ec4899'][Math.floor(Math.random() * 3)],
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleSelect = (mode: 'car' | 'rocket' | 'walk') => {
    setSelectedMode(mode);

    // Play selection sound
    try {
      const selectSound = new Audio('/select.mp3');
      selectSound.volume = 0.4;
      selectSound.play().catch(() => {});
    } catch (e) {}

    // Trigger selection animation
    setTimeout(() => {
      onSelect(mode);
    }, 600);
  };

  const handleHover = (modeId: string) => {
    setHoveredMode(modeId);
    
    // Play hover sound
    if (audioRef.current[modeId]) {
      audioRef.current[modeId].currentTime = 0;
      audioRef.current[modeId].play().catch(() => {});
    }
  };

  const modes: ModeData[] = [
    {
      id: 'car',
      emoji: '🚗',
      title: 'Drive Car',
      subtitle: 'Ground Cruiser',
      description: 'Cruise through the cosmos with style and precision',
      color: 'from-orange-500 via-red-500 to-pink-500',
      glow: 'rgba(239, 68, 68, 0.6)',
      stats: [
        { label: 'Speed', value: '★★★★☆' },
        { label: 'Control', value: '★★★★★' },
        { label: 'Agility', value: '★★★☆☆' },
      ],
      icon3D: '🏎️',
    },
    {
      id: 'rocket',
      emoji: '🚀',
      title: 'Fly Rocket',
      subtitle: 'Space Explorer',
      description: 'Blast through dimensions with unlimited freedom',
      color: 'from-purple-500 via-pink-500 to-blue-500',
      glow: 'rgba(139, 92, 246, 0.6)',
      stats: [
        { label: 'Speed', value: '★★★★★' },
        { label: 'Control', value: '★★★☆☆' },
        { label: 'Agility', value: '★★★★★' },
      ],
      icon3D: '🛸',
    },
    {
      id: 'walk',
      emoji: '🧑‍🚀',
      title: 'Walk',
      subtitle: 'Astronaut Mode',
      description: 'Explore at your own pace with full immersion',
      color: 'from-emerald-500 via-teal-500 to-cyan-500',
      glow: 'rgba(16, 185, 129, 0.6)',
      stats: [
        { label: 'Speed', value: '★★☆☆☆' },
        { label: 'Control', value: '★★★★★' },
        { label: 'Agility', value: '★★★★☆' },
      ],
      icon3D: '👨‍🚀',
    },
  ];

  return (
    <div className="mode-root">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ANIMATED BACKGROUND LAYERS */}
      <div className="mode-stars"></div>
      <div className="mode-stars-layer2"></div>
      <div className="mode-stars-layer3"></div>
      <div className="mode-streaks"></div>
      <div className="mode-nebula" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}></div>

      {/* FLOATING PARTICLES */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="mode-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            background: `radial-gradient(circle, ${particle.color}, transparent)`,
          }}
        />
      ))}

      {/* PLANET DECORATION */}
      <div className="mode-planet" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}></div>
      <div className="mode-planet-ring"></div>

      {/* CONTENT */}
      <div className="mode-content">
        {/* TITLE */}
        <div className="mode-title-container">
          <h1 className="mode-title">Choose Your Journey</h1>
          <p className="mode-subtitle">Select your mode of exploration</p>
        </div>

        {/* MODE BUTTONS */}
        <div className="mode-buttons">
          {modes.map((mode, index) => (
            <button
              key={mode.id}
              className={`mode-btn ${selectedMode === mode.id ? 'mode-btn-selected' : ''} ${
                hoveredMode === mode.id ? 'mode-btn-hovered' : ''
              }`}
              onMouseEnter={() => handleHover(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              onClick={() => handleSelect(mode.id)}
              style={{
                '--glow-color': mode.glow,
                '--index': index,
              } as React.CSSProperties}
            >
              {/* Border rings */}
              <div className="mode-btn-bg" />
              <div className={`mode-btn-gradient bg-gradient-to-r ${mode.color}`} />

              {/* Content */}
              <div className="mode-btn-content">
                <span className="mode-btn-emoji">{mode.emoji}</span>
                <div className="mode-btn-text">
                  <span className="mode-btn-title">{mode.title}</span>
                  <span className="mode-btn-subtitle">{mode.subtitle}</span>
                </div>

                {/* Description on hover */}
                {showDetails && hoveredMode === mode.id && (
                  <div className="mode-btn-description">
                    <p>{mode.description}</p>
                    <div className="mode-stats">
                      {mode.stats.map((stat, i) => (
                        <div key={i} className="mode-stat">
                          <span className="mode-stat-label">{stat.label}:</span>
                          <span className="mode-stat-value">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3D Icon floating effect */}
                {hoveredMode === mode.id && (
                  <div className="mode-3d-icon">{mode.icon3D}</div>
                )}
              </div>

              {/* Hover particles effect */}
              {hoveredMode === mode.id && (
                <>
                  {[0, 120, 240].map((angle, i) => (
                    <div
                      key={i}
                      className="mode-btn-particle"
                      style={{ '--angle': `${angle}deg` } as React.CSSProperties}
                    />
                  ))}
                </>
              )}

              {/* Selection ripple */}
              {selectedMode === mode.id && (
                <>
                  <div className="mode-btn-ripple" />
                  <div className="mode-btn-ripple" style={{ animationDelay: '0.2s' }} />
                </>
              )}

              {/* Unlock badge for special modes */}
              {mode.id === 'rocket' && (
                <div className="mode-badge">RECOMMENDED</div>
              )}
            </button>
          ))}
        </div>

        {/* INFO TEXT */}
        <div className="mode-info">
          <div className="mode-info-line" />
          <p className="mode-info-text">
            {hoveredMode
              ? `Hover to see ${modes.find(m => m.id === hoveredMode)?.title} details`
              : 'Each journey offers a unique experience'}
          </p>
          <div className="mode-info-line" />
        </div>

        {/* TIPS SECTION */}
        {showDetails && (
          <div className="mode-tips">
            <div className="mode-tip">
              <span className="mode-tip-icon">💡</span>
              <span>Use WASD to move</span>
            </div>
            <div className="mode-tip">
              <span className="mode-tip-icon">⚡</span>
              <span>Hold SHIFT to boost</span>
            </div>
            <div className="mode-tip">
              <span className="mode-tip-icon">🌍</span>
              <span>Press E to enter planets</span>
            </div>
          </div>
        )}
      </div>

      {/* CORNER DECORATIONS */}
      <div className="mode-corner mode-corner-tl" />
      <div className="mode-corner mode-corner-tr" />
      <div className="mode-corner mode-corner-bl" />
      <div className="mode-corner mode-corner-br" />

      {/* ADDITIONAL STYLES */}
      <style>{`
        .mode-btn-description {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 20px;
          padding: 16px 20px;
          background: rgba(15, 23, 42, 0.95);
          border: 2px solid rgba(96, 165, 250, 0.3);
          border-radius: 12px;
          min-width: 280px;
          z-index: 10;
          animation: descriptionFadeIn 0.3s ease-out;
          backdrop-filter: blur(10px);
        }

        @keyframes descriptionFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .mode-btn-description p {
          color: #cbd5e1;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .mode-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mode-stat {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }

        .mode-stat-label {
          color: #94a3b8;
        }

        .mode-stat-value {
          color: #60a5fa;
          font-weight: 600;
        }

        .mode-3d-icon {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 48px;
          animation: icon3DFloat 2s ease-in-out infinite;
          filter: drop-shadow(0 10px 30px rgba(96, 165, 250, 0.5));
        }

        @keyframes icon3DFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0) rotateY(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-15px) rotateY(180deg);
          }
        }

        .mode-badge {
          position: absolute;
          top: -12px;
          right: -12px;
          padding: 4px 12px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          border-radius: 12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5);
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .mode-tips {
          display: flex;
          gap: 24px;
          margin-top: 32px;
          animation: tipsFadeIn 1s ease-out 1.2s backwards;
        }

        @keyframes tipsFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mode-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(96, 165, 250, 0.2);
          border-radius: 20px;
          font-size: 13px;
          color: #cbd5e1;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .mode-tip:hover {
          background: rgba(15, 23, 42, 0.8);
          border-color: rgba(96, 165, 250, 0.5);
          transform: translateY(-2px);
        }

        .mode-tip-icon {
          font-size: 18px;
        }

        .mode-btn-hovered {
          animation: btnHoverPulse 0.6s ease-out;
        }

        @keyframes btnHoverPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Enhanced button particles */
        .mode-btn-particle {
          box-shadow: 0 0 15px var(--glow-color, #60a5fa);
        }
      `}</style>
    </div>
  );
}