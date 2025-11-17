import { useEffect, useState } from "react";

export default function MiniMap() {
  const [rocket, setRocket] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function onR(e: any) {
      setRocket({ x: e.detail.x, y: e.detail.y });
    }
    window.addEventListener("rocket-screen-pos", onR as any);
    return () => window.removeEventListener("rocket-screen-pos", onR as any);
  }, []);

  return (
    <div style={{
      position: "fixed",
      right: 20,
      top: 20,
      width: 180,
      height: 120,
      borderRadius: 12,
      padding: 8,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.04)",
      color: "#cfe8ef",
      zIndex: 50,
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>SPACE MAP</div>
      <div style={{ fontSize: 12, opacity: 0.9 }}>
        Projects → (front-right)
        <br />
        Skills ← (front-left)
        <br />
        Photography ↗ (far right)
      </div>

      <div style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        width: 14,
        height: 14,
        borderRadius: 14,
        background: "#06b6d4",
        transform: `translate(${(rocket.x - window.innerWidth / 2) / 200}px, ${(rocket.y - window.innerHeight / 2) / 200}px)`,
      }} />
    </div>
  );
}
