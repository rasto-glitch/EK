import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily, SMOOTH } from "../theme";
import { useCmp } from "./copy";
import { FRAME } from "./timings";

const GLITCH_END = 20;
const COLLAPSE_END = 40;
const SLICES = 6;

// 15–17.5s — the bad site glitches apart, collapses, and a new dark frame
// springs together under the "Your website" title.
export const Rebuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useCmp();

  const glitchIntensity =
    frame < GLITCH_END
      ? interpolate(frame, [0, GLITCH_END], [0.25, 1])
      : 0;

  const collapse = interpolate(frame, [GLITCH_END, COLLAPSE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const titleIn = spring({ frame: frame - 42, fps, config: SMOOTH });
  // clean exit before the scene ends — no hard cut into the good site
  const titleOut = interpolate(frame, [62, 74], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

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

      {/* title — its own clean beat on the empty background */}
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
          opacity: titleIn * titleOut,
          transform: `translateY(${(1 - titleIn) * 30 - (1 - titleOut) * 26}px) scale(${(0.92 + titleIn * 0.08) * (1 + (1 - titleOut) * 0.04)})`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: c.fontFamily,
              fontWeight: 800,
              fontSize: 86,
              letterSpacing: c.rtl ? undefined : "-0.03em",
              lineHeight: c.rtl ? 1.4 : undefined,
              color: colors.text,
              textShadow: `0 0 40px ${colors.accentGlow}`,
            }}
          >
            {c.yourWebsite}
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
