// src/components/AchievementProgress.tsx
import { useState } from "react";
import { useAchievementStore } from "../stores/achievementStore";

export default function AchievementProgress() {
  const [expanded, setExpanded] = useState(false);
  const achievements = useAchievementStore((s) => s.achievements);
  const totalProgress = useAchievementStore((s) => s.totalProgress);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const categoryCounts = {
    exploration: achievements.filter((a) => a.category === "exploration").length,
    speed: achievements.filter((a) => a.category === "speed").length,
    interaction: achievements.filter((a) => a.category === "interaction").length,
    secret: achievements.filter((a) => a.category === "secret").length,
  };

  const categoryUnlocked = {
    exploration: achievements.filter((a) => a.category === "exploration" && a.unlocked).length,
    speed: achievements.filter((a) => a.category === "speed" && a.unlocked).length,
    interaction: achievements.filter((a) => a.category === "interaction" && a.unlocked).length,
    secret: achievements.filter((a) => a.category === "secret" && a.unlocked).length,
  };

  const rarityColors = {
    common: "#94a3b8",
    rare: "#3b82f6",
    epic: "#8b5cf6",
    legendary: "#f59e0b",
  };

  return (
    <>
      <style>{`
        .progress-container {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .progress-mini {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid rgba(14, 165, 233, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .progress-mini:hover {
          border-color: rgba(14, 165, 233, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(14, 165, 233, 0.4);
        }

        .progress-expanded {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          padding: 24px;
          border-radius: 16px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          min-width: 400px;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .progress-expanded::-webkit-scrollbar {
          width: 8px;
        }

        .progress-expanded::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .progress-expanded::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.5);
          border-radius: 10px;
        }

        .progress-bar-bg {
          height: 8px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9, #06b6d4, #8b5cf6);
          background-size: 200% 100%;
          animation: progressShimmer 2s linear infinite;
          border-radius: 10px;
          transition: width 0.5s ease;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.6);
        }

        @keyframes progressShimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .achievement-item {
          padding: 12px;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .achievement-item:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateX(4px);
        }

        .achievement-locked {
          opacity: 0.5;
          filter: grayscale(1);
        }

        .achievement-icon-large {
          font-size: 36px;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }

        .category-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mini-progress-ring {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .ring-bg {
          stroke: rgba(30, 41, 59, 0.8);
        }

        .ring-progress {
          stroke: #0ea5e9;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease;
          filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.8));
        }
      `}</style>

      <div className="progress-container">
        {!expanded ? (
          <div className="progress-mini" onClick={() => setExpanded(true)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Mini circular progress */}
              <svg className="mini-progress-ring" viewBox="0 0 40 40">
                <circle
                  className="ring-bg"
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  strokeWidth="3"
                />
                <circle
                  className="ring-progress"
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - totalProgress / 100)}`}
                  transform="rotate(-90 20 20)"
                />
                <text
                  x="20"
                  y="20"
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize="10"
                  fontWeight="700"
                  fill="#00d4ff"
                >
                  {totalProgress}%
                </text>
              </svg>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#ffffff",
                    marginBottom: 2,
                  }}
                >
                  🏆 Achievements
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {unlockedCount}/{totalCount} Unlocked
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="progress-expanded">
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#ffffff",
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  🏆 Achievements
                </h2>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                  {unlockedCount}/{totalCount} Unlocked • {totalProgress}% Complete
                </p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid rgba(14, 165, 233, 0.3)",
                  color: "#00d4ff",
                  padding: "8px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.6)";
                  e.currentTarget.style.background = "rgba(30, 41, 59, 1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.3)";
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.8)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Overall Progress Bar */}
            <div style={{ marginBottom: 24 }}>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${totalProgress}%` }} />
              </div>
            </div>

            {/* Category Summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div
                  key={category}
                  style={{
                    padding: 12,
                    background: "rgba(30, 41, 59, 0.5)",
                    borderRadius: 10,
                    border: "1px solid rgba(14, 165, 233, 0.2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: 4,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    {category}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#00d4ff" }}>
                    {categoryUnlocked[category as keyof typeof categoryUnlocked]}/{count}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement List */}
            <div>
              {Object.entries(categoryCounts).map(([category]) => {
                const categoryAchievements = achievements.filter(
                  (a) => a.category === category
                );
                if (categoryAchievements.length === 0) return null;

                return (
                  <div key={category} style={{ marginBottom: 20 }}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#00d4ff",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 12,
                      }}
                    >
                      {category}
                    </h3>

                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`achievement-item ${
                          !achievement.unlocked ? "achievement-locked" : ""
                        }`}
                      >
                        <div className="achievement-icon-large">{achievement.icon}</div>

                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                color: achievement.unlocked ? "#ffffff" : "#64748b",
                              }}
                            >
                              {achievement.title}
                            </span>
                            <span
                              className="category-badge"
                              style={{
                                background: rarityColors[achievement.rarity],
                                color: "white",
                              }}
                            >
                              {achievement.rarity}
                            </span>
                          </div>

                          <p
                            style={{
                              fontSize: 12,
                              color: achievement.unlocked ? "#94a3b8" : "#475569",
                              margin: 0,
                              marginBottom: 6,
                            }}
                          >
                            {achievement.description}
                          </p>

                          {/* Progress bar for incomplete achievements */}
                          {!achievement.unlocked && achievement.maxProgress > 1 && (
                            <div>
                              <div className="progress-bar-bg" style={{ height: 4 }}>
                                <div
                                  className="progress-bar-fill"
                                  style={{
                                    width: `${
                                      (achievement.progress / achievement.maxProgress) * 100
                                    }%`,
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#64748b",
                                  marginTop: 4,
                                }}
                              >
                                {achievement.progress}/{achievement.maxProgress}
                              </div>
                            </div>
                          )}

                          {/* Unlock date */}
                          {achievement.unlocked && achievement.unlockedAt && (
                            <div
                              style={{
                                fontSize: 10,
                                color: "#00d4ff",
                                marginTop: 4,
                              }}
                            >
                              ✓ Unlocked{" "}
                              {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}