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
import { colors, SAFE, SMOOTH, T } from "../theme";

// CTA with pulsing glow; fades out softly into the closing beat.
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLocale();

  const readyIn = spring({ frame: frame - 4, fps, config: SMOOTH });
  const lineIn = spring({ frame: frame - 20, fps, config: SMOOTH });
  const emailIn = spring({ frame: frame - 30, fps, config: SMOOTH });
  const siteIn = spring({ frame: frame - 40, fps, config: SMOOTH });
  const markIn = spring({ frame: frame - 52, fps, config: SMOOTH });

  // gentle breathing glow, frame-driven
  const pulse = 0.55 + 0.45 * Math.sin(frame / 11);

  const exit = interpolate(frame, [T.cta.dur - 14, T.cta.dur - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        opacity: exit,
      }}
    >
      <div
        style={{
          fontFamily: L.fontFamily,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: L.rtl ? undefined : "-0.03em",
          lineHeight: L.rtl ? 1.4 : undefined,
          color: colors.text,
          direction: L.rtl ? "rtl" : "ltr",
          opacity: readyIn,
          transform: `translateY(${(1 - readyIn) * 34}px) scale(${0.92 + readyIn * 0.08})`,
        }}
      >
        {L.copy.ctaHeading}
      </div>

      <AccentLine progress={lineIn} width={260} style={{ marginTop: 52 }} />

      <div
        style={{
          marginTop: 56,
          fontFamily: L.fontFamily,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: "-0.01em",
          color: colors.accent,
          opacity: emailIn,
          transform: `translateY(${(1 - emailIn) * 26}px)`,
          textShadow: `0 0 ${18 + pulse * 26}px rgba(78,157,232,${0.35 + pulse * 0.35})`,
        }}
      >
        {L.copy.email}
      </div>
      <div
        style={{
          marginTop: 20,
          fontFamily: L.fontFamily,
          fontWeight: 300,
          fontSize: 40,
          letterSpacing: "0.06em",
          color: colors.textDim,
          opacity: siteIn,
          transform: `translateY(${(1 - siteIn) * 20}px)`,
        }}
      >
        {L.copy.site}
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
