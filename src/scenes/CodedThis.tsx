import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AccentLine } from "../components/AccentLine";
import { Logo } from "../components/Logo";
import { useLocale } from "../locales";
import { colors, SAFE, SMOOTH } from "../theme";

// Closing beat — "We coded this video. We can code your website." + the mark.
// Holds until the end of the video (no exit).
export const CodedThis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLocale();

  const markIn = spring({ frame: frame - 4, fps, config: SMOOTH });
  const line1In = spring({ frame: frame - 20, fps, config: SMOOTH });
  const line2In = spring({ frame: frame - 48, fps, config: SMOOTH });
  const accentIn = spring({ frame: frame - 66, fps, config: SMOOTH });

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
          opacity: markIn,
          transform: `scale(${0.9 + markIn * 0.1}) translateY(${(1 - markIn) * 20}px)`,
        }}
      >
        <Logo size={170} />
      </div>

      <div
        style={{
          marginTop: 64,
          fontFamily: L.fontFamily,
          fontWeight: 300,
          fontSize: 46,
          color: colors.textDim,
          textAlign: "center",
          direction: L.rtl ? "rtl" : "ltr",
          lineHeight: L.rtl ? 1.5 : 1.25,
          opacity: line1In,
          transform: `translateY(${(1 - line1In) * 24}px)`,
        }}
      >
        {L.copy.codedLine1}
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: L.fontFamily,
          fontWeight: 700,
          fontSize: 58,
          letterSpacing: L.rtl ? undefined : "-0.02em",
          color: colors.accent,
          textAlign: "center",
          direction: L.rtl ? "rtl" : "ltr",
          lineHeight: L.rtl ? 1.5 : 1.2,
          opacity: line2In,
          transform: `translateY(${(1 - line2In) * 26}px) scale(${0.95 + line2In * 0.05})`,
          textShadow: `0 0 30px ${colors.accentGlow}`,
        }}
      >
        {L.copy.codedLine2}
      </div>

      <AccentLine progress={accentIn} width={280} style={{ marginTop: 56 }} />
    </AbsoluteFill>
  );
};
