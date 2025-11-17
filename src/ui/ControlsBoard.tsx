import { Html } from "@react-three/drei";

export default function ControlsBoard() {
  return (
    <Html center>
      <div
        style={{
          padding: "18px 20px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.92)",
          color: "#07323a",
          fontFamily: "Inter, sans-serif",
          minWidth: "220px",
          boxShadow: "0 10px 30px rgba(16,24,40,0.06)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>CONTROLS</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>W/A/S/D — Move</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>Shift — Boost</div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>E — Enter Planet</div>
      </div>
    </Html>
  );
}
