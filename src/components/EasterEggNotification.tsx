// src/components/EasterEggNotification.tsx
import { useState, useEffect } from "react";
import type { EasterEgg } from "../systems/easterEggSystem";

export default function EasterEggNotification() {
  const [egg, setEgg] = useState<EasterEgg | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleEggFound = (e: any) => {
      setEgg(e.detail.egg);
      setVisible(true);
      
      setTimeout(() => setVisible(false), 6000);
    };

    window.addEventListener("easter-egg-found", handleEggFound);
    return () => window.removeEventListener("easter-egg-found", handleEggFound);
  }, []);

  if (!egg || !visible) return null;

  const rarityColors = {
    common: "#10b981",
    rare: "#8b5cf6",
    legendary: "#f59e0b",
  };

  const rarityGlow = {
    common: "rgba(16, 185, 129, 0.6)",
    rare: "rgba(139, 92, 246, 0.6)",
    legendary: "rgba(245, 158, 11, 0.8)",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10000,
        animation: "eggAppear 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes eggAppear {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .egg-notification {
          position: relative;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          min-width: 400px;
          text-align: center;
          border: 3px solid ${rarityColors[egg.rarity]};
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8),
                      0 0 60px ${rarityGlow[egg.rarity]};
          animation: float 3s ease-in-out infinite;
        }

        .sparkle {
          position: absolute;
          width: 20px;
          height: 20px;
          background: ${rarityColors[egg.rarity]};
          border-radius: 50%;
          animation: sparkle 2s ease-in-out infinite;
          box-shadow: 0 0 20px ${rarityGlow[egg.rarity]};
        }

        .egg-icon-large {
          font-size: 120px;
          margin-bottom: 20px;
          animation: float 2s ease-in-out infinite;
          filter: drop-shadow(0 10px 40px ${rarityGlow[egg.rarity]});
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: ${rarityColors[egg.rarity]};
          animation: confettiFall 3s ease-out forwards;
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="egg-notification">
        {/* Sparkles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const distance = 150;
          return (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          );
        })}

        {/* Confetti */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`confetti-${i}`}
            className="confetti"
            style={{
              left: `${50 + (Math.random() - 0.5) * 100}%`,
              top: "0",
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
          />
        ))}

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: rarityColors[egg.rarity],
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 20,
              textShadow: `0 0 20px ${rarityGlow[egg.rarity]}`,
            }}
          >
            🥚 EASTER EGG FOUND!
          </div>

          <div className="egg-icon-large">{egg.icon}</div>

          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              marginBottom: 12,
              textShadow: `0 0 30px ${rarityGlow[egg.rarity]}`,
            }}
          >
            {egg.name}
          </h2>

          <p
            style={{
              fontSize: 16,
              color: "#cbd5e1",
              lineHeight: 1.6,
              margin: 0,
              marginBottom: 20,
            }}
          >
            {egg.description}
          </p>

          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              borderRadius: 20,
              background: rarityColors[egg.rarity],
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              boxShadow: `0 0 30px ${rarityGlow[egg.rarity]}`,
            }}
          >
            {egg.rarity} Discovery
          </div>

          {egg.id === "secret_planet" && (
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: "rgba(0, 0, 0, 0.4)",
                borderRadius: 12,
                border: "2px solid rgba(245, 158, 11, 0.5)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24", marginBottom: 8 }}>
                🌑 Secret Planet Unlocked!
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                Planet X has appeared in the galaxy. Go explore it!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}