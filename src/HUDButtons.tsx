import { useEffect, useState } from "react";
import "./HUDButtons.css";

export default function HUDButtons() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      setPos({ x: e.detail.x, y: e.detail.y });
      setVisible(true);
    };

    window.addEventListener("rocket-screen-pos", handler);
    return () => window.removeEventListener("rocket-screen-pos", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="hud-buttons"
      style={{
        left: pos.x - 40,
        top: pos.y + 30,
        position: "fixed",
      }}
    >
      <button
        onClick={() => window.dispatchEvent(new Event("press-e"))}
        className="hud-enter-btn"
      >
        Enter
      </button>
    </div>
  );
}
