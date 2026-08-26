import { colors } from "../theme";

// Animated pointer. `press` (0..1) dips the scale like a real click.
export const Cursor: React.FC<{
  x: number;
  y: number;
  press?: number;
  opacity?: number;
  tone?: "light" | "dark";
}> = ({ x, y, press = 0, opacity = 1, tone = "light" }) => {
  return (
    <svg
      viewBox="0 0 32 44"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 46,
        height: 63,
        opacity,
        transform: `scale(${1 - press * 0.22})`,
        transformOrigin: "6px 4px",
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.45))",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <path
        d="M6 2 L6 34 L14 27 L19.5 40 L25 37.5 L19.5 25 L28 24 Z"
        fill={tone === "light" ? "#FFFFFF" : "#0B0F1A"}
        stroke={tone === "light" ? "#111318" : colors.accent}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Expanding ring shown right after a click.
export const Ripple: React.FC<{
  x: number;
  y: number;
  clickFrame: number;
  frame: number;
  color?: string;
}> = ({ x, y, clickFrame, frame, color = "rgba(0,0,0,0.35)" }) => {
  const d = frame - clickFrame;
  if (d < 0 || d > 16) return null;
  const p = d / 16;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 30 * p,
        top: y - 30 * p,
        width: 60 * p,
        height: 60 * p,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        opacity: 1 - p,
        pointerEvents: "none",
        zIndex: 49,
      }}
    />
  );
};
