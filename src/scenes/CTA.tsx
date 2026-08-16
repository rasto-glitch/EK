import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AccentLine } from "../components/AccentLine";
import { Logo } from "../components/Logo";
import { colors, fontFamily, SAFE, SMOOTH } from "../theme";

// 17–20s — CTA with pulsing glow. Holds until the end (no exit).
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const readyIn = spring({ frame: frame - 4, fps, config: SMOOTH });
  const lineIn = spring({ frame: frame - 20, fps, config: SMOOTH });
  const emailIn = spring({ frame: frame - 30, fps, config: SMOOTH });
  const siteIn = spring({ frame: frame - 40, fps, config: SMOOTH });
  const markIn = spring({ frame: frame - 52, fps, config: SMOOTH });

  // gentle breathing glow, frame-driven
  const pulse = 0.55 + 0.45 * Math.sin(frame / 11);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.03em",
          color: colors.text,
          opacity: readyIn,
          transform: `translateY(${(1 - readyIn) * 34}px) scale(${0.92 + readyIn * 0.08})`,
        }}
      >
        Ready to start?
      </div>

      <AccentLine progress={lineIn} width={260} style={{ marginTop: 52 }} />

      <div
        style={{
          marginTop: 56,
          fontFamily,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: "-0.01em",
          color: colors.accent,
          opacity: emailIn,
          transform: `translateY(${(1 - emailIn) * 26}px)`,
          textShadow: `0 0 ${18 + pulse * 26}px rgba(78,157,232,${0.35 + pulse * 0.35})`,
        }}
      >
        contact@elkurdi.co
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily,
          fontWeight: 300,
          fontSize: 40,
          letterSpacing: "0.06em",
          color: colors.textDim,
          opacity: siteIn,
          transform: `translateY(${(1 - siteIn) * 20}px)`,
        }}
      >
        elkurdi.co
      </div>

      {/* small EK mark near the bottom, above the safe margin */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom + 30,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: markIn * 0.9,
          transform: `translateY(${(1 - markIn) * 16}px)`,
        }}
      >
        <Logo size={96} />
      </div>
    </AbsoluteFill>
  );
};
