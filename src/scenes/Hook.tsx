import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AccentLine } from "../components/AccentLine";
import { colors, fontFamily, SAFE, SMOOTH } from "../theme";

const WORDS = ["Your", "business", "deserves", "a", "better", "website."];
const STAGGER = 7; // frames between words
const START = 8;

// 0–2.5s — fast word-by-word hook, then a hard cut (no exit animation).
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({
    frame: frame - (START + WORDS.length * STAGGER + 4),
    fps,
    config: SMOOTH,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-start",
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
          fontSize: 92,
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: colors.text,
          display: "flex",
          flexWrap: "wrap",
          columnGap: "0.28em",
        }}
      >
        {WORDS.map((word, i) => {
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
                color: word === "better" ? colors.accent : colors.text,
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
