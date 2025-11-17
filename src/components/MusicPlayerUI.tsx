// src/components/MusicPlayerUI.tsx
import { useState, useEffect, useRef } from "react";
import { useMusicStore } from "../stores/musicSystemStore";

export default function MusicPlayerUI() {
  const [expanded, setExpanded] = useState(false);
  const [visualizer, setVisualizer] = useState<number[]>(new Array(20).fill(0));
  
  const currentTrack = useMusicStore((s) => s.currentTrack);
  const isPlaying = useMusicStore((s) => s.isPlaying);
  const volume = useMusicStore((s) => s.volume);
  const isMuted = useMusicStore((s) => s.isMuted);
  const tracks = useMusicStore((s) => s.tracks);
  const { playTrack, pauseMusic, resumeMusic, setVolume, toggleMute, nextTrack, previousTrack } = useMusicStore();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Get current track info
  const currentTrackInfo = tracks.find((t) => t.id === currentTrack);

  // Audio setup with visualizer
  useEffect(() => {
    if (!currentTrack || !currentTrackInfo) return;

    // Create audio element
    const audio = new Audio(currentTrackInfo.url);
    audio.volume = isMuted ? 0 : volume * (currentTrackInfo.volume || 1);
    audio.loop = true;
    audioRef.current = audio;

    // Create audio context for visualizer
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyserRef.current = analyser;
    } catch (e) {
      console.log("Audio context not supported");
    }

    // Play audio
    if (isPlaying) {
      audio.play().catch((err) => {
        console.log("Audio play failed:", err);
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      if (analyserRef.current) {
        analyserRef.current = null;
      }
    };
  }, [currentTrack, currentTrackInfo]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume * (currentTrackInfo?.volume || 1);
    }
  }, [volume, isMuted, currentTrackInfo]);

  // Play/Pause control
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Audio play failed:", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Visualizer animation
  useEffect(() => {
    if (!analyserRef.current || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setVisualizer(new Array(20).fill(0));
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const animate = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Sample 20 bars from frequency data
      const bars = Array.from({ length: 20 }, (_, i) => {
        const index = Math.floor((i / 20) * dataArray.length);
        return dataArray[index] / 255;
      });
      
      setVisualizer(bars);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, analyserRef.current]);

  // ✅ FIXED: Music event listeners with proper dependency
  useEffect(() => {
    const handlePause = () => pauseMusic();
    const handleResume = () => resumeMusic();
    const handleVolume = (e: any) => setVolume(e.detail.volume);
    const handleMute = (e: any) => {
      if (e.detail.muted && audioRef.current) {
        audioRef.current.volume = 0;
      }
    };
    const handleStop = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };

    window.addEventListener("music-pause", handlePause);
    window.addEventListener("music-resume", handleResume);
    window.addEventListener("music-volume", handleVolume);
    window.addEventListener("music-mute", handleMute);
    window.addEventListener("music-stop", handleStop);

    return () => {
      window.removeEventListener("music-pause", handlePause);
      window.removeEventListener("music-resume", handleResume);
      window.removeEventListener("music-volume", handleVolume);
      window.removeEventListener("music-mute", handleMute);
      window.removeEventListener("music-stop", handleStop);
    };
  }, [pauseMusic, resumeMusic, setVolume]);

  if (!currentTrack) return null;

  return (
    <>
      <style>{`
        .music-player {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 200;
          transition: all 0.3s ease;
        }

        .music-player-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .music-player-mini:hover {
          border-color: #0ea5e9;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(14, 165, 233, 0.4);
        }

        .music-player-expanded {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 2px solid rgba(14, 165, 233, 0.4);
          padding: 24px;
          min-width: 350px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }

        .visualizer {
          display: flex;
          gap: 2px;
          height: 32px;
          align-items: flex-end;
          justify-content: center;
        }

        .visualizer-bar {
          width: 4px;
          background: linear-gradient(to top, #0ea5e9, #06b6d4);
          border-radius: 2px;
          transition: height 0.1s ease;
          box-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
        }

        .control-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(14, 165, 233, 0.4);
          background: rgba(30, 41, 59, 0.8);
          color: #00d4ff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          border-color: #0ea5e9;
          background: rgba(14, 165, 233, 0.2);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
        }

        .control-btn-large {
          width: 50px;
          height: 50px;
          font-size: 20px;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          border-color: transparent;
          color: white;
        }

        .control-btn-large:hover {
          transform: scale(1.15);
          box-shadow: 0 0 24px rgba(14, 165, 233, 0.8);
        }

        .volume-slider {
          width: 100%;
          height: 4px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.8);
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(14, 165, 233, 0.8);
          border: none;
        }

        .track-list {
          max-height: 200px;
          overflow-y: auto;
          margin-top: 16px;
        }

        .track-list::-webkit-scrollbar {
          width: 6px;
        }

        .track-list::-webkit-scrollbar-thumb {
          background: rgba(14, 165, 233, 0.5);
          border-radius: 4px;
        }

        .track-item {
          padding: 10px 12px;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 8px;
          margin-bottom: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .track-item:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(14, 165, 233, 0.4);
          transform: translateX(4px);
        }

        .track-item-active {
          background: rgba(14, 165, 233, 0.2);
          border-color: #0ea5e9;
        }
      `}</style>

      <div className="music-player">
        {!expanded ? (
          <div className="music-player-mini" onClick={() => setExpanded(true)}>
            {/* Visualizer */}
            <div className="visualizer">
              {visualizer.slice(0, 8).map((height, i) => (
                <div
                  key={i}
                  className="visualizer-bar"
                  style={{
                    height: `${Math.max(height * 32, 4)}px`,
                    animation: !isPlaying ? "none" : undefined,
                  }}
                />
              ))}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 2 }}>
                {currentTrackInfo?.name || "Unknown"}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                {isPlaying ? "🎵 Playing" : "⏸️ Paused"}
              </div>
            </div>

            {/* Mini Controls */}
            <button
              className="control-btn"
              onClick={(e) => {
                e.stopPropagation();
                isPlaying ? pauseMusic() : resumeMusic();
              }}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
          </div>
        ) : (
          <div className="music-player-expanded">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#ffffff", margin: 0 }}>
                🎵 Music Player
              </h3>
              <button
                className="control-btn"
                style={{ width: 32, height: 32, fontSize: 14 }}
                onClick={() => setExpanded(false)}
              >
                ✕
              </button>
            </div>

            {/* Visualizer */}
            <div style={{ marginBottom: 20 }}>
              <div className="visualizer">
                {visualizer.map((height, i) => (
                  <div
                    key={i}
                    className="visualizer-bar"
                    style={{
                      height: `${Math.max(height * 32, 4)}px`,
                      animation: !isPlaying ? "none" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Track Info */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>
                {currentTrackInfo?.name || "Unknown Track"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", textTransform: "capitalize" }}>
                {currentTrackInfo?.category || "Unknown"} {currentTrackInfo?.planet && `• ${currentTrackInfo.planet}`}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <button className="control-btn" onClick={previousTrack}>
                ⏮️
              </button>
              <button className="control-btn control-btn-large" onClick={() => isPlaying ? pauseMusic() : resumeMusic()}>
                {isPlaying ? "⏸️" : "▶️"}
              </button>
              <button className="control-btn" onClick={nextTrack}>
                ⏭️
              </button>
            </div>

            {/* Volume Control */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <button
                  className="control-btn"
                  style={{ width: 36, height: 36, fontSize: 14 }}
                  onClick={toggleMute}
                >
                  {isMuted ? "🔇" : volume > 0.5 ? "🔊" : "🔉"}
                </button>
                <span style={{ fontSize: 12, color: "#00d4ff", fontWeight: 700 }}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="volume-slider"
              />
            </div>

            {/* Track List */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#00d4ff", marginBottom: 8 }}>
                Available Tracks
              </div>
              <div className="track-list">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`track-item ${currentTrack === track.id ? "track-item-active" : ""}`}
                    onClick={() => playTrack(track.id)}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff", marginBottom: 2 }}>
                      {currentTrack === track.id && (isPlaying ? "🎵 " : "⏸️ ")}
                      {track.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "capitalize" }}>
                      {track.category}
                      {track.planet && ` • ${track.planet}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}