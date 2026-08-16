import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AccentLine } from "../components/AccentLine";
import { Logo } from "../components/Logo";
import { useLocale } from "../locales";
import { colors, SMOOTH, T } from "../theme";

// EK mark springs in with a soft glow, tagline underneath.
export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLocale();

  const logoIn = spring({ frame: frame - 6, fps, config: SMOOTH });
  const glow = interpolate(frame, [6, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineIn = spring({ frame: frame - 34, fps, config: SMOOTH });
  const tagIn = spring({ frame: frame - 46, fps, config: SMOOTH });

  // Soft ease-out exit at the end of the scene.
  const exit = interpolate(frame, [T.brand.dur - 14, T.brand.dur - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exit,
        transform: `scale(${1 + (1 - exit) * 0.03})`,
      }}
    >
      {/* soft glow behind the mark */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accentGlow} 0%, transparent 65%)`,
          filter: "blur(70px)",
          opacity: glow * 0.6,
        }}
      />
      <div
        style={{
          opacity: logoIn,
          transform: `scale(${0.88 + logoIn * 0.12}) translateY(${(1 - logoIn) * 26}px)`,
        }}
      >
        <Logo size={330} />
      </div>
      <AccentLine
        progress={lineIn}
        width={330}
        style={{ marginTop: 56 }}
      />
      <div
        style={{
          marginTop: 40,
          fontFamily: L.fontFamily,
          fontWeight: 300,
          fontSize: 46,
          letterSpacing: L.rtl ? undefined : "0.01em",
          color: colors.textDim,
          direction: L.rtl ? "rtl" : "ltr",
          opacity: tagIn,
          transform: `translateY(${(1 - tagIn) * 22}px)`,
        }}
      >
        {L.copy.tagPre}{" "}
        <span style={{ fontWeight: 500, color: colors.text }}>{L.copy.tagBold}</span>
      </div>
    </AbsoluteFill>
  );
};
