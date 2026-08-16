import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AccentLine } from "../components/AccentLine";
import { useLocale } from "../locales";
import { colors, SAFE, SMOOTH } from "../theme";

const STAGGER = 7; // frames between words
const START = 8;

// First scene — fast word-by-word hook, then a hard cut (no exit animation).
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLocale();
  const words = L.copy.hookWords;

  const lineProgress = spring({
    frame: frame - (START + words.length * STAGGER + 4),
    fps,
    config: SMOOTH,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: L.rtl ? "flex-end" : "flex-start",
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
      }}
    >
      <div
        style={{
          fontFamily: L.fontFamily,
          fontWeight: 800,
          fontSize: 92,
          lineHeight: L.rtl ? 1.35 : 1.12,
          letterSpacing: L.rtl ? undefined : "-0.03em",
          color: colors.text,
          display: "flex",
          flexWrap: "wrap",
          columnGap: "0.28em",
          direction: L.rtl ? "rtl" : "ltr",
        }}
      >
        {words.map((word, i) => {
          const s = spring({
            frame: frame - (START + i * STAGGER),
            fps,
            config: SMOOTH,
            durationInFrames: 26,
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: s,
                transform: `translateY(${(1 - s) * 30}px) scale(${0.94 + s * 0.06})`,
                color: i === L.copy.hookAccentIndex ? colors.accent : colors.text,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
      <AccentLine
        progress={lineProgress}
        width={300}
        style={{ marginTop: 42 }}
      />
    </AbsoluteFill>
  );
};
