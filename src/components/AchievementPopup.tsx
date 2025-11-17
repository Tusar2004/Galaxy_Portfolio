// src/components/AchievementPopup.tsx
import { useEffect, useState } from "react";
import { useAchievementStore } from "../stores/achievementStore";

export default function AchievementPopup() {
  const recentUnlock = useAchievementStore((s) => s.recentUnlock);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recentUnlock) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock]);

  if (!recentUnlock || !visible) return null;

  const rarityColors = {
    common: "#94a3b8",
    rare: "#3b82f6",
    epic: "#8b5cf6",
    legendary: "#f59e0b",
  };

  const rarityGlow = {
    common: "rgba(148, 163, 184, 0.4)",
    rare: "rgba(59, 130, 246, 0.6)",
    epic: "rgba(139, 92, 246, 0.6)",
    legendary: "rgba(245, 158, 11, 0.8)",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 24,
        zIndex: 9999,
        animation: "slideInRight 0.5s ease-out, pulse 0.5s ease-out 0.5s",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-5px) rotate(5deg);
          }
        }

        .achievement-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 20px;
          min-width: 320px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 
                      0 0 40px ${rarityGlow[recentUnlock.rarity]};
          border: 2px solid ${rarityColors[recentUnlock.rarity]};
          position: relative;
          overflow: hidden;
        }

        .achievement-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .achievement-icon {
          animation: iconBounce 0.6s ease-out;
        }

        .rarity-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: ${rarityColors[recentUnlock.rarity]};
          color: white;
          box-shadow: 0 0 20px ${rarityGlow[recentUnlock.rarity]};
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: ${rarityColors[recentUnlock.rarity]};
          border-radius: 50%;
          animation: particleBurst 1s ease-out forwards;
        }

        @keyframes particleBurst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `}</style>

      <div className="achievement-card">
        {/* Particles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const distance = 100;
          return (
            <div
              key={i}
              className="particle"
              style={{
                left: "50%",
                top: "50%",
                // @ts-ignore
                "--tx": `${Math.cos(angle) * distance}px`,
                "--ty": `${Math.sin(angle) * distance}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          );
        })}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#00d4ff",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              🏆 Achievement Unlocked!
            </span>
            <span className="rarity-badge">{recentUnlock.rarity}</span>
          </div>

          {/* Content */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              className="achievement-icon"
              style={{
                fontSize: 56,
                filter: `drop-shadow(0 0 20px ${rarityGlow[recentUnlock.rarity]})`,
              }}
            >
              {recentUnlock.icon}
            </div>

            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: 6,
                  textShadow: `0 0 20px ${rarityGlow[recentUnlock.rarity]}`,
                }}
              >
                {recentUnlock.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#cbd5e1",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {recentUnlock.description}
              </p>
            </div>
          </div>

          {/* Progress indicator (if applicable) */}
          {recentUnlock.maxProgress > 1 && (
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: 8,
                fontSize: 12,
                color: "#94a3b8",
                textAlign: "center",
              }}
            >
              Completed: {recentUnlock.progress}/{recentUnlock.maxProgress}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}