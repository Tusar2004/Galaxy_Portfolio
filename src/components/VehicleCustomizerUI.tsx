// src/components/VehicleCustomizerUI.tsx
import { useState } from "react";
import { useVehicleCustomizationStore } from "../stores/vehicleCustomizationStore";

const PRESET_OPTIONS = [
  { id: "default", name: "Default", icon: "⚪" },
  { id: "cyberpunk", name: "Cyberpunk", icon: "🌃" },
  { id: "stealth", name: "Stealth", icon: "🌑" },
  { id: "neon", name: "Neon", icon: "💚" },
  { id: "sunset", name: "Sunset", icon: "🌅" },
  { id: "ocean", name: "Ocean", icon: "🌊" },
  { id: "forest", name: "Forest", icon: "🌲" },
  { id: "royal", name: "Royal", icon: "👑" },
  { id: "fire", name: "Fire", icon: "🔥" },
];

const COLOR_PRESETS = [
  "#ff006e", "#8b5cf6", "#3b82f6", "#0ea5e9", "#06b6d4",
  "#14b8a6", "#10b981", "#84cc16", "#eab308", "#f59e0b",
  "#f97316", "#ef4444", "#ec4899", "#ffffff", "#000000",
];

export default function VehicleCustomizerUI() {
  const showCustomizer = useVehicleCustomizationStore((s) => s.showCustomizer);
  const currentVehicle = useVehicleCustomizationStore((s) => s.currentVehicle);
  const customization = useVehicleCustomizationStore((s) => s[currentVehicle]);
  const { setCustomization, toggleCustomizer, applyPreset, resetCustomization } = useVehicleCustomizationStore();
  
  const [activeTab, setActiveTab] = useState<"colors" | "effects" | "presets">("colors");

  if (!showCustomizer) return null;

  const handleColorChange = (property: string, color: string) => {
    setCustomization(currentVehicle, { [property]: color });
  };

  const handleSliderChange = (property: string, value: number) => {
    setCustomization(currentVehicle, { [property]: value });
  };

  return (
    <>
      <style>{`
        .customizer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .customizer-panel {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
          border-radius: 24px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          padding: 32px;
          max-width: 700px;
          width: 90vw;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 60px rgba(14, 165, 233, 0.3);
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .customizer-panel::-webkit-scrollbar {
          width: 10px;
        }

        .customizer-panel::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .customizer-panel::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.5);
          border-radius: 10px;
        }

        .tab-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          padding: 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .tab-btn {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          color: #00d4ff;
          background: rgba(14, 165, 233, 0.1);
        }

        .tab-btn-active {
          background: rgba(14, 165, 233, 0.3);
          color: #00d4ff;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
        }

        .color-section {
          margin-bottom: 24px;
        }

        .color-label {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          display: block;
        }

        .color-picker-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .color-input {
          width: 80px;
          height: 40px;
          border-radius: 10px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .color-input:hover {
          border-color: #0ea5e9;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
        }

        .color-presets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .color-preset-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .color-preset-btn:hover {
          transform: scale(1.15);
          border-color: #0ea5e9;
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.6);
        }

        .slider-section {
          margin-bottom: 24px;
        }

        .slider-label {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }

        .slider {
          width: 100%;
          height: 6px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 6px;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.8);
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.8);
          border: none;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .preset-card {
          padding: 16px;
          background: rgba(30, 41, 59, 0.6);
          border-radius: 12px;
          border: 2px solid rgba(14, 165, 233, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .preset-card:hover {
          border-color: #0ea5e9;
          background: rgba(30, 41, 59, 0.9);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
        }

        .preset-card-active {
          border-color: #0ea5e9;
          background: rgba(14, 165, 233, 0.2);
          box-shadow: 0 0 24px rgba(14, 165, 233, 0.5);
        }

        .preset-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .preset-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(14, 165, 233, 0.2);
        }

        .action-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          background: rgba(30, 41, 59, 0.8);
          color: #00d4ff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: #0ea5e9;
          background: rgba(14, 165, 233, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
        }

        .action-btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white;
          border-color: transparent;
        }

        .action-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.6);
        }

        .action-btn-danger {
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
        }

        .action-btn-danger:hover {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }
      `}</style>

      <div className="customizer-overlay" onClick={toggleCustomizer}>
        <div className="customizer-panel" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#ffffff",
                margin: 0,
                marginBottom: 8,
                background: "linear-gradient(to right, #00ffff, #00aaff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🎨 Vehicle Customization
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
              Customize your {currentVehicle === "rocket" ? "🚀 Rocket" : currentVehicle === "car" ? "🚗 Car" : "🧑‍🚀 Astronaut"}
            </p>
          </div>

          {/* Tabs */}
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "colors" ? "tab-btn-active" : ""}`}
              onClick={() => setActiveTab("colors")}
            >
              🎨 Colors
            </button>
            <button
              className={`tab-btn ${activeTab === "effects" ? "tab-btn-active" : ""}`}
              onClick={() => setActiveTab("effects")}
            >
              ✨ Effects
            </button>
            <button
              className={`tab-btn ${activeTab === "presets" ? "tab-btn-active" : ""}`}
              onClick={() => setActiveTab("presets")}
            >
              🎭 Presets
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "colors" && (
            <div>
              {/* Primary Color */}
              <div className="color-section">
                <label className="color-label">Primary Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                    className="color-input"
                  />
                  <div className="color-presets">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        className="color-preset-btn"
                        style={{ background: color }}
                        onClick={() => handleColorChange("primaryColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Color */}
              <div className="color-section">
                <label className="color-label">Secondary Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={customization.secondaryColor}
                    onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                    className="color-input"
                  />
                  <div className="color-presets">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        className="color-preset-btn"
                        style={{ background: color }}
                        onClick={() => handleColorChange("secondaryColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div className="color-section">
                <label className="color-label">Accent Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={customization.accentColor}
                    onChange={(e) => handleColorChange("accentColor", e.target.value)}
                    className="color-input"
                  />
                  <div className="color-presets">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        className="color-preset-btn"
                        style={{ background: color }}
                        onClick={() => handleColorChange("accentColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Trail Color */}
              <div className="color-section">
                <label className="color-label">Trail Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={customization.trailColor}
                    onChange={(e) => handleColorChange("trailColor", e.target.value)}
                    className="color-input"
                  />
                  <div className="color-presets">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        className="color-preset-btn"
                        style={{ background: color }}
                        onClick={() => handleColorChange("trailColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Glow Color */}
              <div className="color-section">
                <label className="color-label">Glow Color</label>
                <div className="color-picker-group">
                  <input
                    type="color"
                    value={customization.glowColor}
                    onChange={(e) => handleColorChange("glowColor", e.target.value)}
                    className="color-input"
                  />
                  <div className="color-presets">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        className="color-preset-btn"
                        style={{ background: color }}
                        onClick={() => handleColorChange("glowColor", color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "effects" && (
            <div>
              {/* Trail Intensity */}
              <div className="slider-section">
                <div className="slider-label">
                  <span>Trail Intensity</span>
                  <span style={{ color: "#00d4ff" }}>{Math.round(customization.trailIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={customization.trailIntensity}
                  onChange={(e) => handleSliderChange("trailIntensity", Number(e.target.value))}
                  className="slider"
                />
              </div>

              {/* Glow Intensity */}
              <div className="slider-section">
                <div className="slider-label">
                  <span>Glow Intensity</span>
                  <span style={{ color: "#00d4ff" }}>{Math.round(customization.glowIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={customization.glowIntensity}
                  onChange={(e) => handleSliderChange("glowIntensity", Number(e.target.value))}
                  className="slider"
                />
              </div>

              {/* Preview */}
              <div
                style={{
                  marginTop: 24,
                  padding: 24,
                  background: "rgba(0, 0, 0, 0.4)",
                  borderRadius: 12,
                  border: "2px solid rgba(14, 165, 233, 0.3)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 12 }}>
                  Effect Preview
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "20px 40px",
                    borderRadius: 12,
                    background: customization.primaryColor,
                    color: customization.accentColor,
                    fontSize: 24,
                    fontWeight: 900,
                    boxShadow: `0 0 ${30 * customization.glowIntensity}px ${customization.glowColor}`,
                    filter: `drop-shadow(0 0 ${15 * customization.trailIntensity}px ${customization.trailColor})`,
                  }}
                >
                  {currentVehicle === "rocket" ? "🚀" : currentVehicle === "car" ? "🚗" : "🧑‍🚀"}
                </div>
              </div>
            </div>
          )}

          {activeTab === "presets" && (
            <div>
              <div className="preset-grid">
                {PRESET_OPTIONS.map((preset) => (
                  <div
                    key={preset.id}
                    className={`preset-card ${customization.preset === preset.id ? "preset-card-active" : ""}`}
                    onClick={() => applyPreset(currentVehicle, preset.id)}
                  >
                    <div className="preset-icon">{preset.icon}</div>
                    <div className="preset-name">{preset.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn action-btn-danger" onClick={() => resetCustomization(currentVehicle)}>
              🔄 Reset
            </button>
            <button className="action-btn" onClick={toggleCustomizer}>
              Cancel
            </button>
            <button className="action-btn action-btn-primary" onClick={toggleCustomizer}>
              ✓ Apply & Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}