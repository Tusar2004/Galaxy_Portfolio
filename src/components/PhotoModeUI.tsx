// src/components/PhotoModeUI.tsx
import { useState } from "react";
import { usePhotoModeStore } from "../stores/photoModeStore";

const FILTERS = [
  { id: "none", name: "None", css: "" },
  { id: "vintage", name: "Vintage", css: "sepia(0.5) contrast(1.2)" },
  { id: "noir", name: "Noir", css: "grayscale(1) contrast(1.3)" },
  { id: "vivid", name: "Vivid", css: "saturate(1.8) contrast(1.1)" },
  { id: "cool", name: "Cool", css: "hue-rotate(180deg) saturate(1.2)" },
  { id: "warm", name: "Warm", css: "hue-rotate(30deg) saturate(1.3)" },
  { id: "cyberpunk", name: "Cyberpunk", css: "saturate(2) hue-rotate(270deg) contrast(1.2)" },
  { id: "dreamy", name: "Dreamy", css: "blur(0.5px) brightness(1.1) saturate(1.3)" },
];

export default function PhotoModeUI() {
  const isPhotoMode = usePhotoModeStore((s) => s.isPhotoMode);
  const currentFilter = usePhotoModeStore((s) => s.currentFilter);
  const photos = usePhotoModeStore((s) => s.photos);
  const { togglePhotoMode, setFilter, capturePhoto, deletePhoto } = usePhotoModeStore();
  
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [fov, setFov] = useState(60);

  const handleCapture = () => {
    // Get canvas directly from DOM
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    
    const imageData = canvas.toDataURL("image/png");
    capturePhoto(imageData);
    
    // Track achievement
    window.dispatchEvent(new CustomEvent("photo-taken"));
  };

  const handleDownload = (imageData: string, photoId: string) => {
    const link = document.createElement("a");
    link.download = `portfolio-galaxy-${photoId}.png`;
    link.href = imageData;
    link.click();
  };

  const handleShare = async (imageData: string) => {
    try {
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], "portfolio-galaxy.png", { type: "image/png" });
      
      if (navigator.share) {
        await navigator.share({
          title: "Space Portfolio Galaxy",
          text: "Check out this amazing 3D portfolio!",
          files: [file],
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Image copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Sharing not supported. Image will be downloaded instead.");
      handleDownload(imageData, `${Date.now()}`);
    }
  };

  if (!isPhotoMode && !showGallery) return null;

  return (
    <>
      <style>{`
        .photo-mode-ui {
          position: fixed;
          inset: 0;
          z-index: 500;
          pointer-events: none;
        }

        .photo-controls {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 20px 32px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          pointer-events: auto;
        }

        .photo-btn {
          padding: 12px 24px;
          border-radius: 12px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          background: rgba(30, 41, 59, 0.8);
          color: #00d4ff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .photo-btn:hover {
          border-color: #0ea5e9;
          background: rgba(14, 165, 233, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
        }

        .photo-btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          color: white;
          border-color: transparent;
          font-size: 16px;
          padding: 16px 32px;
        }

        .photo-btn-primary:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.6);
        }

        .filter-selector {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          max-width: 400px;
          padding: 4px;
        }

        .filter-selector::-webkit-scrollbar {
          height: 4px;
        }

        .filter-selector::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.5);
          border-radius: 4px;
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(14, 165, 233, 0.3);
          background: rgba(30, 41, 59, 0.6);
          color: #cbd5e1;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          border-color: #0ea5e9;
          color: #00d4ff;
        }

        .filter-btn-active {
          background: rgba(14, 165, 233, 0.3);
          border-color: #0ea5e9;
          color: #00d4ff;
        }

        .photo-info {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          padding: 16px 20px;
          border-radius: 12px;
          border: 2px solid rgba(14, 165, 233, 0.3);
          color: white;
          font-size: 14px;
          pointer-events: auto;
        }

        .crosshair {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
        }

        .crosshair::before,
        .crosshair::after {
          content: "";
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
        }

        .crosshair::before {
          width: 2px;
          height: 12px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .crosshair::after {
          width: 12px;
          height: 2px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .gallery-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 600;
          display: flex;
          flex-direction: column;
          padding: 40px;
          pointer-events: auto;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          overflow-y: auto;
          padding: 20px;
        }

        .gallery-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid rgba(14, 165, 233, 0.2);
        }

        .gallery-item:hover {
          transform: scale(1.05);
          border-color: #0ea5e9;
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4);
        }

        .gallery-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .gallery-item-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-item-actions {
          opacity: 1;
        }

        .fov-slider {
          width: 150px;
          height: 4px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
        }

        .fov-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.6);
        }

        .fov-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.6);
        }
      `}</style>

      {isPhotoMode && (
        <div className="photo-mode-ui">
          {/* Crosshair */}
          <div className="crosshair" />

          {/* Photo Info */}
          <div className="photo-info">
            <div style={{ fontWeight: 700, marginBottom: 8, color: "#00d4ff" }}>
              📸 PHOTO MODE
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
              Filter: {FILTERS.find((f) => f.id === currentFilter)?.name}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Photos: {photos.length}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
              Space - Capture | Tab - Gallery | P - Exit
            </div>
          </div>

          {/* Controls */}
          <div className="photo-controls">
            {/* Filter Selector */}
            <div className="filter-selector">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-btn ${currentFilter === filter.id ? "filter-btn-active" : ""}`}
                  onClick={() => setFilter(filter.id)}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: 2, height: 40, background: "rgba(14, 165, 233, 0.3)" }} />

            {/* FOV Slider */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 11, color: "#94a3b8" }}>FOV: {fov}°</label>
              <input
                type="range"
                min="30"
                max="120"
                value={fov}
                onChange={(e) => {
                  const newFov = Number(e.target.value);
                  setFov(newFov);
                  window.dispatchEvent(
                    new CustomEvent("camera-fov-change", { detail: { fov: newFov } })
                  );
                }}
                className="fov-slider"
              />
            </div>

            {/* Divider */}
            <div style={{ width: 2, height: 40, background: "rgba(14, 165, 233, 0.3)" }} />

            {/* Capture Button */}
            <button className="photo-btn photo-btn-primary" onClick={handleCapture}>
              📸 CAPTURE
            </button>

            {/* Gallery Button */}
            <button className="photo-btn" onClick={() => setShowGallery(true)}>
              🖼️ Gallery ({photos.length})
            </button>

            {/* Exit Button */}
            <button className="photo-btn" onClick={togglePhotoMode}>
              ✕ Exit
            </button>
          </div>

          {/* Apply filter overlay */}
          {currentFilter !== "none" && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                filter: FILTERS.find((f) => f.id === currentFilter)?.css,
                zIndex: 1,
              }}
            />
          )}
        </div>
      )}

      {/* Gallery */}
      {showGallery && (
        <div className="gallery-overlay">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", margin: 0 }}>
              📸 Photo Gallery
            </h2>
            <button
              className="photo-btn"
              onClick={() => {
                setShowGallery(false);
                setSelectedPhoto(null);
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Selected Photo View */}
          {selectedPhoto ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
              <img
                src={selectedPhoto}
                alt="Selected"
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  border: "2px solid rgba(14, 165, 233, 0.4)",
                }}
              />
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  className="photo-btn"
                  onClick={() => handleDownload(selectedPhoto, `${Date.now()}`)}
                >
                  💾 Download
                </button>
                <button className="photo-btn" onClick={() => handleShare(selectedPhoto)}>
                  🔗 Share
                </button>
                <button
                  className="photo-btn"
                  onClick={() => {
                    const photo = photos.find((p) => p.imageData === selectedPhoto);
                    if (photo) deletePhoto(photo.id);
                    setSelectedPhoto(null);
                  }}
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                >
                  🗑️ Delete
                </button>
                <button className="photo-btn" onClick={() => setSelectedPhoto(null)}>
                  ← Back to Grid
                </button>
              </div>
            </div>
          ) : (
            <div className="gallery-grid">
              {photos.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: 60,
                    color: "#94a3b8",
                  }}
                >
                  <div style={{ fontSize: 64, marginBottom: 16 }}>📸</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>No photos yet</div>
                  <div style={{ fontSize: 14, marginTop: 8 }}>
                    Press P to enter Photo Mode and capture your first shot!
                  </div>
                </div>
              ) : (
                photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="gallery-item"
                    onClick={() => setSelectedPhoto(photo.imageData)}
                  >
                    <img src={photo.imageData} alt={`Photo ${photo.id}`} />
                    <div className="gallery-item-actions">
                      <button
                        className="photo-btn"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo.imageData, photo.id);
                        }}
                      >
                        💾
                      </button>
                      <button
                        className="photo-btn"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo.imageData);
                        }}
                      >
                        🔗
                      </button>
                      <button
                        className="photo-btn"
                        style={{
                          padding: "6px 12px",
                          fontSize: 12,
                          borderColor: "#ef4444",
                          color: "#ef4444",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto(photo.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}