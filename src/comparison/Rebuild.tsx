import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily, SMOOTH } from "../theme";
import { FRAME } from "./timings";

const GLITCH_END = 20;
const COLLAPSE_END = 40;
const SLICES = 6;

// 15–17.5s — the bad site glitches apart, collapses, and a new dark frame
// springs together under the "Your website" title.
export const Rebuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glitchIntensity =
    frame < GLITCH_END
      ? interpolate(frame, [0, GLITCH_END], [0.25, 1])
      : 0;

  const collapse = interpolate(frame, [GLITCH_END, COLLAPSE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const rebuild = spring({
    frame: frame - COLLAPSE_END,
    fps,
    config: SMOOTH,
    durationInFrames: 30,
  });
  const titleIn = spring({ frame: frame - 50, fps, config: SMOOTH });

  // deterministic pseudo-random slice offsets, re-rolled every 2 frames
  const sliceOffset = (i: number) =>
    ((((Math.floor(frame / 2) * 17 + i * 37) % 23) - 11) / 11) * 34 * glitchIntensity;

  const sliceH = FRAME.height / SLICES;

  return (
    <AbsoluteFill>
      {/* dying site (white, sliced) */}
      {frame < COLLAPSE_END && (
        <div
          style={{
            position: "absolute",
            left: FRAME.left,
            top: FRAME.top,
            width: FRAME.width,
            height: FRAME.height,
            transform: `scale(${1 - collapse}) translateY(${collapse * 380}px) rotate(${collapse * 7}deg)`,
            opacity: 1 - collapse * 0.9,
          }}
        >
          {/* RGB-split ghosts */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background: "rgba(255,60,90,0.35)",
              transform: `translateX(${-9 * glitchIntensity}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              background: "rgba(60,200,255,0.35)",
              transform: `translateX(${9 * glitchIntensity}px)`,
            }}
          />
          {/* sliced white page with the 404 still on it */}
          {Array.from({ length: SLICES }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: i * sliceH,
                width: "100%",
                height: sliceH,
                overflow: "hidden",
                transform: `translateX(${sliceOffset(i)}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: -i * sliceH,
                  width: FRAME.width,
                  height: FRAME.height,
                  background: "#FFFFFF",
                  borderRadius: 24,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 230,
                    letterSpacing: "-0.04em",
                    color: "#1B1E24",
                    lineHeight: 1,
                  }}
                >
                  404
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* new dark frame springs together */}
      {frame >= COLLAPSE_END && (
        <div
          style={{
            position: "absolute",
            left: FRAME.left,
            top: FRAME.top,
            width: FRAME.width,
            height: FRAME.height,
            borderRadius: 24,
            background: "#0E1116",
            border: `1.5px solid rgba(78,157,232,0.35)`,
            boxShadow: `0 0 60px rgba(78,157,232,${0.25 * rebuild}), 0 40px 90px rgba(0,0,0,0.55)`,
            opacity: rebuild,
            transform: `scale(${0.62 + rebuild * 0.38}) translateY(${(1 - rebuild) * 260}px)`,
          }}
        />
      )}

      {/* title */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 30}px) scale(${0.92 + titleIn * 0.08})`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 86,
              letterSpacing: "-0.03em",
              color: colors.text,
              textShadow: `0 0 40px ${colors.accentGlow}`,
            }}
          >
            Your website
          </div>
          <div
            style={{
              margin: "26px auto 0",
              width: 230,
              height: 3,
              borderRadius: 2,
              background: colors.accent,
              boxShadow: `0 0 18px ${colors.accentGlow}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
