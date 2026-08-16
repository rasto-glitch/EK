import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useLocale } from "../locales";
import { colors, SAFE, SMOOTH, T, WIDTH } from "../theme";

const FILL_START = 26;
const FILL_END = 112;

// Proof line + progress track with three checkpoints lighting up.
// In RTL the track fills right-to-left with the first step on the right.
export const ProcessLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLocale();

  const headIn = spring({ frame: frame - 2, fps, config: SMOOTH });
  const trackIn = spring({ frame: frame - 12, fps, config: SMOOTH });

  const progress = interpolate(frame, [FILL_START, FILL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const exit = interpolate(frame, [T.process.dur - 14, T.process.dur - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const trackWidth = WIDTH - SAFE.left - SAFE.right - 40;

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
          fontWeight: 700,
          fontSize: 66,
          lineHeight: L.rtl ? 1.5 : 1.18,
          letterSpacing: L.rtl ? undefined : "-0.025em",
          color: colors.text,
          textAlign: "center",
          maxWidth: 860,
          direction: L.rtl ? "rtl" : "ltr",
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 30}px) scale(${0.94 + headIn * 0.06})`,
        }}
      >
        {L.copy.processPre}{" "}
        <span style={{ color: colors.accent }}>{L.copy.processAccent}</span>
      </div>

      {/* progress track */}
      <div
        style={{
          marginTop: 130,
          width: trackWidth,
          opacity: trackIn,
          transform: `translateY(${(1 - trackIn) * 30}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.1)",
          }}
        >
          {/* fill — anchored to the start side of the reading direction */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              ...(L.rtl ? { right: 0 } : { left: 0 }),
              width: `${progress * 100}%`,
              borderRadius: 3,
              background: L.rtl
                ? `linear-gradient(270deg, ${colors.accentDeep}, ${colors.accent})`
                : `linear-gradient(90deg, ${colors.accentDeep}, ${colors.accent})`,
              boxShadow: `0 0 20px ${colors.accentGlow}`,
            }}
          />
          {/* checkpoints */}
          {L.copy.steps.map((label, i) => {
            const at = i / (L.copy.steps.length - 1);
            const eff = L.rtl ? 1 - at : at; // visual position along the track
            const litFrame =
              FILL_START + (FILL_END - FILL_START) * (0.08 + at * 0.84);
            const lit = spring({
              frame: frame - litFrame,
              fps,
              config: SMOOTH,
              durationInFrames: 24,
            });
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: `${eff * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: colors.bg,
                    border: `3px solid ${lit > 0.3 ? colors.accent : "rgba(255,255,255,0.22)"}`,
                    boxShadow: lit > 0.3 ? `0 0 ${24 * lit}px ${colors.accentGlow}` : "none",
                    transform: `scale(${1 + lit * 0.18 - Math.min(lit, 1) * 0.18 + lit * 0.08})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: colors.accent,
                      opacity: lit,
                      transform: `scale(${lit})`,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 54,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontFamily: L.fontFamily,
                    fontWeight: 500,
                    fontSize: 32,
                    color: lit > 0.3 ? colors.text : colors.textDim,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
