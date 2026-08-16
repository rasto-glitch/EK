import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, HEIGHT, WIDTH } from "../theme";

// Blurred gradient orbs drifting very slowly. Runs behind every scene;
// receives the GLOBAL frame (mounted outside all Sequences).
export const Background: React.FC = () => {
  const f = useCurrentFrame();

  const orb = (
    color: string,
    size: number,
    cx: number,
    cy: number,
    dx: number,
    dy: number,
    speed: number,
    phase: number
  ) => (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
        left: cx - size / 2 + Math.sin(f * speed + phase) * dx,
        top: cy - size / 2 + Math.cos(f * speed * 0.8 + phase) * dy,
      }}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {orb(colors.orbA, 900, WIDTH * 0.15, HEIGHT * 0.2, 90, 60, 0.006, 0)}
      {orb(colors.orbB, 1100, WIDTH * 0.9, HEIGHT * 0.65, 70, 100, 0.005, 2.1)}
      {orb(colors.orbC, 800, WIDTH * 0.4, HEIGHT * 0.95, 100, 50, 0.007, 4.4)}
      {/* soft vignette to keep edges dark and premium */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
