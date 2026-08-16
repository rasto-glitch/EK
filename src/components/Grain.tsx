import { AbsoluteFill, useCurrentFrame } from "remotion";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Faint film grain. Position jitters with the frame so it shimmers slightly
// (frame-driven — no CSS animation).
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const jx = (f * 7) % 280;
  const jy = (f * 13) % 280;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundPosition: `${jx}px ${jy}px`,
        opacity: 0.06,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
