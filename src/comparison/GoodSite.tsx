import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily, SMOOTH } from "../theme";
import { Cursor, Ripple } from "./Cursor";
import { clickPulse, cursorPath, FRAME, G, Waypoint } from "./timings";

const SITE = {
  page: "#0E1116",
  card: "#161B23",
  line: "rgba(255,255,255,0.08)",
};

// nav item x-centers in page coords (y ≈ 48)
const NAV_ITEMS = [
  { label: "Home", x: 250 },
  { label: "Work", x: 410 },
  { label: "About", x: 570 },
];
// canvas coords
const NAV_Y = FRAME.top + FRAME.chrome + 48;
const navCanvasX = (px: number) => FRAME.left + px;
const CTA = { x: FRAME.left + 320, y: FRAME.top + FRAME.chrome + 560 }; // hero button center

const PATH: Waypoint[] = [
  { t: G.hoverHome - 22, x: 640, y: 1420 },
  { t: G.hoverHome, x: navCanvasX(NAV_ITEMS[0].x), y: NAV_Y },
  { t: G.hoverWork - 8, x: navCanvasX(NAV_ITEMS[0].x), y: NAV_Y },
  { t: G.hoverWork, x: navCanvasX(NAV_ITEMS[1].x), y: NAV_Y },
  { t: G.hoverAbout - 5, x: navCanvasX(NAV_ITEMS[1].x), y: NAV_Y },
  { t: G.hoverAbout, x: navCanvasX(NAV_ITEMS[2].x), y: NAV_Y },
  { t: G.press - 12, x: navCanvasX(NAV_ITEMS[2].x), y: NAV_Y },
  { t: G.press - 2, x: CTA.x, y: CTA.y },
  { t: G.scrollStart, x: CTA.x, y: CTA.y },
  { t: G.scrollStart + 18, x: 620, y: 1240 },
];

export const GoodSite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipIn = spring({ frame: frame - G.chipIn, fps, config: SMOOTH });

  // fast, confident stagger — the whole page is up in ~a second
  const el = (delay: number) =>
    spring({
      frame: frame - G.loadStart - delay,
      fps,
      config: SMOOTH,
      durationInFrames: 18,
    });

  // menu underline glides between items
  const hoverPos =
    spring({ frame: frame - G.hoverWork, fps, config: SMOOTH, durationInFrames: 16 }) +
    spring({ frame: frame - G.hoverAbout, fps, config: SMOOTH, durationInFrames: 16 });
  const underlineX = interpolate(
    hoverPos,
    [0, 1, 2],
    NAV_ITEMS.map((n) => n.x)
  );
  const underlineIn = spring({ frame: frame - (G.hoverHome - 2), fps, config: SMOOTH });

  // Contact press → button dips, check draws
  const pressDip = clickPulse(frame, G.press);
  const pressed = frame >= G.press + 4;
  const check = spring({
    frame: frame - G.checkDraw,
    fps,
    config: SMOOTH,
    durationInFrames: 26,
  });

  // parallax scroll — three layers at different speeds
  const scroll = interpolate(frame, [G.scrollStart, G.scrollEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const pos = cursorPath(frame, PATH);
  const cursorOpacity =
    interpolate(frame, [G.hoverHome - 24, G.hoverHome - 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [G.scrollStart + 14, G.scrollStart + 26], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const hoveredItem = hoverPos < 0.5 ? 0 : hoverPos < 1.5 ? 1 : 2;

  return (
    <AbsoluteFill>
      {/* top chip */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: chipIn,
          transform: `translateY(${(1 - chipIn) * -14}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 26px",
            borderRadius: 999,
            border: `1.5px solid rgba(78,157,232,0.4)`,
            background: "rgba(19,19,24,0.8)",
            fontFamily,
            fontWeight: 500,
            fontSize: 30,
            color: colors.text,
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 7,
              background: colors.accent,
              boxShadow: `0 0 10px ${colors.accentGlow}`,
            }}
          />
          Your website
        </div>
      </div>

      {/* browser frame */}
      <div
        style={{
          position: "absolute",
          left: FRAME.left,
          top: FRAME.top,
          width: FRAME.width,
          height: FRAME.height,
          borderRadius: 24,
          overflow: "hidden",
          border: "1.5px solid rgba(78,157,232,0.28)",
          boxShadow: `0 0 60px rgba(78,157,232,0.14), 0 40px 90px rgba(0,0,0,0.55)`,
        }}
      >
        {/* chrome bar */}
        <div
          style={{
            height: FRAME.chrome,
            background: "#151A21",
            borderBottom: `1px solid ${SITE.line}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 26px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ width: 17, height: 17, borderRadius: 9, background: "rgba(255,255,255,0.16)" }}
            />
          ))}
          <div
            style={{
              marginLeft: 16,
              flex: 1,
              height: 40,
              borderRadius: 20,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${SITE.line}`,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              fontFamily,
              fontSize: 24,
              color: colors.textDim,
            }}
          >
            <span style={{ color: colors.accent, marginRight: 8 }}>●</span> elkurdi.co
          </div>
        </div>

        {/* page */}
        <div
          style={{
            position: "relative",
            height: FRAME.height - FRAME.chrome,
            background: SITE.page,
            overflow: "hidden",
          }}
        >
          {/* nav — fixed during scroll */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 96,
              borderBottom: `1px solid ${SITE.line}`,
              background: SITE.page,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              padding: "0 40px",
              opacity: el(0),
              transform: `translateY(${(1 - el(0)) * -20}px)`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: colors.accent,
                boxShadow: `0 0 14px ${colors.accentGlow}`,
              }}
            />
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.label}
                style={{
                  position: "absolute",
                  left: item.x - 50,
                  width: 100,
                  textAlign: "center",
                  fontFamily,
                  fontWeight: 500,
                  fontSize: 27,
                  color: hoveredItem === i && underlineIn > 0.5 ? colors.text : colors.textDim,
                  transform: `scale(${hoveredItem === i && underlineIn > 0.5 ? 1.06 : 1})`,
                }}
              >
                {item.label}
              </div>
            ))}
            {/* glowing underline */}
            <div
              style={{
                position: "absolute",
                top: 74,
                left: underlineX - 34,
                width: 68,
                height: 4,
                borderRadius: 2,
                background: colors.accent,
                boxShadow: `0 0 14px ${colors.accentGlow}`,
                opacity: underlineIn,
              }}
            />
          </div>

          {/* hero layer — slowest parallax */}
          <div style={{ position: "absolute", inset: 0, top: 96, transform: `translateY(${-scroll * 130}px)` }}>
            <div
              style={{
                margin: "34px 40px 0",
                height: 380,
                borderRadius: 18,
                background: `linear-gradient(135deg, ${colors.accentDeep} 0%, ${colors.accent} 100%)`,
                opacity: 0.92 * el(4),
                transform: `translateY(${(1 - el(4)) * 40}px)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 36,
              }}
            >
              <div style={{ width: 420 * el(8), height: 30, borderRadius: 15, background: "rgba(255,255,255,0.9)" }} />
              <div style={{ marginTop: 16, width: 300 * el(11), height: 20, borderRadius: 10, background: "rgba(255,255,255,0.55)" }} />
            </div>

            {/* Contact button */}
            <div
              style={{
                margin: "40px 40px 0",
                width: 280,
                height: 78,
                borderRadius: 39,
                background: pressed ? "rgba(78,157,232,0.16)" : colors.accent,
                border: pressed ? `2px solid ${colors.accent}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                opacity: el(14),
                transform: `translateY(${(1 - el(14)) * 30}px) scale(${1 - pressDip * 0.07})`,
                boxShadow: pressed
                  ? `0 0 ${28 + check * 14}px ${colors.accentGlow}`
                  : `0 10px 30px rgba(78,157,232,0.35)`,
              }}
            >
              {pressed ? (
                <>
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="none">
                    <path
                      d="M4 12.5 L9.5 18 L20 6.5"
                      stroke={colors.accent}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={24}
                      strokeDashoffset={24 * (1 - check)}
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 700,
                      fontSize: 28,
                      color: colors.text,
                      opacity: check,
                    }}
                  >
                    Message sent
                  </span>
                </>
              ) : (
                <span style={{ fontFamily, fontWeight: 700, fontSize: 28, color: "#0B0F1A" }}>
                  Contact us
                </span>
              )}
            </div>
          </div>

          {/* cards layer — mid parallax */}
          <div style={{ position: "absolute", inset: 0, top: 96, transform: `translateY(${-scroll * 260}px)` }}>
            <div style={{ display: "flex", gap: 24, margin: "700px 40px 0" }}>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 230,
                    borderRadius: 16,
                    background: SITE.card,
                    border: `1px solid ${SITE.line}`,
                    padding: 26,
                    opacity: el(18 + i * 3),
                    transform: `translateY(${(1 - el(18 + i * 3)) * 34}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      background: "rgba(78,157,232,0.16)",
                      border: `1px solid rgba(78,157,232,0.4)`,
                    }}
                  />
                  <div style={{ marginTop: 22, width: "80%", height: 18, borderRadius: 9, background: "rgba(255,255,255,0.16)" }} />
                  <div style={{ marginTop: 12, width: "55%", height: 18, borderRadius: 9, background: "rgba(255,255,255,0.08)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* deep layer — fastest parallax (revealed by the scroll) */}
          <div style={{ position: "absolute", inset: 0, top: 96, transform: `translateY(${-scroll * 400}px)` }}>
            <div
              style={{
                margin: "990px 40px 0",
                height: 300,
                borderRadius: 16,
                background: SITE.card,
                border: `1px solid ${SITE.line}`,
                padding: 30,
              }}
            >
              <div style={{ width: 320, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.2)" }} />
              <div style={{ marginTop: 18, width: "90%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.09)" }} />
              <div style={{ marginTop: 12, width: "76%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.09)" }} />
              <div
                style={{
                  marginTop: 26,
                  width: 210,
                  height: 56,
                  borderRadius: 28,
                  background: colors.accent,
                  opacity: 0.9,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ripple + cursor */}
      <Ripple
        x={CTA.x + 10}
        y={CTA.y + 10}
        clickFrame={G.press}
        frame={frame}
        color="rgba(78,157,232,0.6)"
      />
      {cursorOpacity > 0 && (
        <Cursor x={pos.x} y={pos.y} press={pressDip} opacity={cursorOpacity} tone="dark" />
      )}
    </AbsoluteFill>
  );
};
