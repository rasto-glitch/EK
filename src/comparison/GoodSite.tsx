import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, SMOOTH } from "../theme";
import { useCmp } from "./copy";
import { Cursor, Ripple } from "./Cursor";
import { clickPulse, cursorPath, FRAME, G, Waypoint } from "./timings";

const SITE = {
  page: "#0E1116",
  card: "#161B23",
  line: "rgba(255,255,255,0.08)",
};

// nav item x-centers in page coords (nav row is 96px tall)
const NAV_ITEMS = [
  { label: "Home", x: 250 },
  { label: "Work", x: 410 },
  { label: "About", x: 570 },
];
const NAV_Y = FRAME.top + FRAME.chrome + 52; // canvas y of the nav labels
const navX = (px: number) => FRAME.left + px;

// "Contact us" button on the ABOUT page — canvas center of the button.
// Derived from the About layout below: 34+90 (avatar row) + 30+88 (text bars)
// + 44 (margin) + 39 (half button) = 325 below the nav.
const CTA = { x: FRAME.left + 180, y: FRAME.top + FRAME.chrome + 96 + 325 };

const PATH: Waypoint[] = [
  { t: G.clickHome - 24, x: 640, y: 1420 },
  { t: G.clickHome - 3, x: navX(NAV_ITEMS[0].x), y: NAV_Y },
  { t: G.clickWork - 10, x: navX(NAV_ITEMS[0].x), y: NAV_Y },
  { t: G.clickWork - 3, x: navX(NAV_ITEMS[1].x), y: NAV_Y },
  { t: G.clickAbout - 10, x: navX(NAV_ITEMS[1].x), y: NAV_Y },
  { t: G.clickAbout - 3, x: navX(NAV_ITEMS[2].x), y: NAV_Y },
  { t: G.press - 16, x: navX(NAV_ITEMS[2].x), y: NAV_Y },
  { t: G.press - 3, x: CTA.x, y: CTA.y },
  { t: G.scrollStart, x: CTA.x, y: CTA.y },
  { t: G.scrollStart + 18, x: 640, y: 1260 },
];

export const GoodSite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useCmp();
  const fontFamily = c.fontFamily;

  const chipIn = spring({ frame: frame - G.chipIn, fps, config: SMOOTH });
  const frameIn = spring({ frame: frame - 2, fps, config: SMOOTH, durationInFrames: 26 });

  // Home assembles fast and confident
  const el = (delay: number) =>
    spring({ frame: frame - G.loadStart - delay, fps, config: SMOOTH, durationInFrames: 18 });
  // Work / About page elements stagger from their own tab click
  const wl = (delay: number) =>
    spring({ frame: frame - G.clickWork - 4 - delay, fps, config: SMOOTH, durationInFrames: 16 });
  const al = (delay: number) =>
    spring({ frame: frame - G.clickAbout - 4 - delay, fps, config: SMOOTH, durationInFrames: 16 });

  // page transitions — 0→1 as Work then About take over
  const toWork = spring({ frame: frame - G.clickWork, fps, config: SMOOTH, durationInFrames: 18 });
  const toAbout = spring({ frame: frame - G.clickAbout, fps, config: SMOOTH, durationInFrames: 18 });

  // underline glides with the page changes
  const hoverPos = toWork + toAbout;
  const underlineX = interpolate(hoverPos, [0, 1, 2], NAV_ITEMS.map((n) => n.x));
  const underlineIn = spring({ frame: frame - (G.clickHome - 4), fps, config: SMOOTH });
  const activeItem = hoverPos < 0.5 ? 0 : hoverPos < 1.5 ? 1 : 2;

  // Contact press → button dips, check draws
  const pressDip = Math.max(
    clickPulse(frame, G.clickHome),
    clickPulse(frame, G.clickWork),
    clickPulse(frame, G.clickAbout),
    clickPulse(frame, G.press)
  );
  const pressed = frame >= G.press + 4;
  const check = spring({ frame: frame - G.checkDraw, fps, config: SMOOTH, durationInFrames: 26 });

  // gentle parallax settle on the About page after "Message sent"
  const scroll = interpolate(frame, [G.scrollStart, G.scrollEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const pos = cursorPath(frame, PATH);
  const cursorOpacity =
    interpolate(frame, [G.clickHome - 26, G.clickHome - 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [G.scrollStart + 14, G.scrollStart + 26], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // page layer styles: exit left, enter from right — buttery
  const pageStyle = (enter: number, exit: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    top: 96,
    opacity: enter * (1 - exit),
    transform: `translateX(${(1 - enter) * 90 - exit * 90}px)`,
  });

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
          {c.yourWebsite}
        </div>
      </div>

      {/* browser frame — springs up after the title has cleared */}
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
          opacity: frameIn,
          transform: `translateY(${(1 - frameIn) * 80}px) scale(${0.95 + frameIn * 0.05})`,
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

        {/* page area */}
        <div
          style={{
            position: "relative",
            height: FRAME.height - FRAME.chrome,
            background: SITE.page,
            overflow: "hidden",
          }}
        >
          {/* nav — persistent */}
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
                  left: item.x - 65,
                  width: 130,
                  textAlign: "center",
                  fontFamily,
                  fontWeight: 500,
                  fontSize: 27,
                  color: activeItem === i && underlineIn > 0.5 ? colors.text : colors.textDim,
                  transform: `scale(${activeItem === i && underlineIn > 0.5 ? 1.06 : 1})`,
                }}
              >
                {c.navItems[i]}
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

          {/* ------------------------- HOME ------------------------- */}
          <div style={pageStyle(1, toWork)}>
            <div
              style={{
                margin: "34px 40px 0",
                height: 400,
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
            <div style={{ display: "flex", gap: 24, margin: "34px 40px 0" }}>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 250,
                    borderRadius: 16,
                    background: SITE.card,
                    border: `1px solid ${SITE.line}`,
                    padding: 26,
                    opacity: el(14 + i * 3),
                    transform: `translateY(${(1 - el(14 + i * 3)) * 34}px)`,
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
            <div style={{ margin: "34px 40px 0", height: 140, borderRadius: 16, background: SITE.card, border: `1px solid ${SITE.line}`, opacity: el(20) }} />
          </div>

          {/* ------------------------- WORK ------------------------- */}
          <div style={pageStyle(toWork, toAbout)}>
            <div
              style={{
                margin: "34px 40px 0",
                fontFamily,
                fontWeight: 700,
                fontSize: 34,
                color: colors.text,
                opacity: wl(0),
                transform: `translateY(${(1 - wl(0)) * 20}px)`,
                direction: c.rtl ? "rtl" : "ltr",
                textAlign: c.rtl ? "right" : "left",
              }}
            >
              {c.selectedWork}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, margin: "26px 40px 0" }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "calc(50% - 12px)",
                    height: 300,
                    borderRadius: 16,
                    overflow: "hidden",
                    background: SITE.card,
                    border: `1px solid ${SITE.line}`,
                    opacity: wl(4 + i * 4),
                    transform: `translateY(${(1 - wl(4 + i * 4)) * 36}px)`,
                  }}
                >
                  <div
                    style={{
                      height: 190,
                      background: `linear-gradient(${120 + i * 40}deg, ${colors.accentDeep} 0%, ${colors.accent} 100%)`,
                      opacity: 0.55 + i * 0.1,
                    }}
                  />
                  <div style={{ padding: 20 }}>
                    <div style={{ width: "70%", height: 18, borderRadius: 9, background: "rgba(255,255,255,0.18)" }} />
                    <div style={{ marginTop: 12, width: "45%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.08)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------- ABOUT ------------------------- */}
          {/* main layer — drifts up slightly in the closing parallax */}
          <div style={{ ...pageStyle(toAbout, 0), transform: `translateX(${(1 - toAbout) * 90}px) translateY(${-scroll * 90}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26, margin: "34px 40px 0", opacity: al(0), transform: `translateY(${(1 - al(0)) * 20}px)` }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  background: `linear-gradient(135deg, ${colors.accentDeep}, ${colors.accent})`,
                  boxShadow: `0 0 20px rgba(78,157,232,0.35)`,
                }}
              />
              <div>
                <div style={{ width: 260, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.22)" }} />
                <div style={{ marginTop: 12, width: 180, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.1)" }} />
              </div>
            </div>
            <div style={{ margin: "30px 40px 0" }}>
              <div style={{ width: "88%", height: 20, borderRadius: 10, background: "rgba(255,255,255,0.12)", opacity: al(4) }} />
              <div style={{ marginTop: 14, width: "72%", height: 20, borderRadius: 10, background: "rgba(255,255,255,0.12)", opacity: al(6) }} />
              <div style={{ marginTop: 14, width: "80%", height: 20, borderRadius: 10, background: "rgba(255,255,255,0.08)", opacity: al(8) }} />
            </div>

            {/* Contact us — the button the whole journey leads to */}
            <div
              style={{
                margin: "44px 40px 0",
                width: 280,
                height: 78,
                borderRadius: 39,
                background: pressed ? "rgba(78,157,232,0.16)" : colors.accent,
                border: pressed ? `2px solid ${colors.accent}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                opacity: al(12),
                transform: `translateY(${(1 - al(12)) * 26}px) scale(${1 - clickPulse(frame, G.press) * 0.07})`,
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
                  <span style={{ fontFamily, fontWeight: 700, fontSize: 28, color: colors.text, opacity: check }}>
                    {c.messageSent}
                  </span>
                </>
              ) : (
                <span style={{ fontFamily, fontWeight: 700, fontSize: 28, color: "#0B0F1A" }}>
                  {c.contactUs}
                </span>
              )}
            </div>
          </div>

          {/* About deep layer — faster parallax, revealed by the settle */}
          <div style={{ ...pageStyle(toAbout, 0), transform: `translateX(${(1 - toAbout) * 90}px) translateY(${-scroll * 190}px)` }}>
            <div
              style={{
                margin: "760px 40px 0",
                height: 340,
                borderRadius: 16,
                background: SITE.card,
                border: `1px solid ${SITE.line}`,
                padding: 30,
                opacity: al(16),
              }}
            >
              <div style={{ width: 300, height: 24, borderRadius: 12, background: "rgba(255,255,255,0.2)" }} />
              <div style={{ marginTop: 18, width: "90%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.09)" }} />
              <div style={{ marginTop: 12, width: "74%", height: 16, borderRadius: 8, background: "rgba(255,255,255,0.09)" }} />
              <div style={{ marginTop: 26, width: 210, height: 56, borderRadius: 28, background: colors.accent, opacity: 0.9 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ripples + cursor (tip-accurate) */}
      <Ripple x={navX(NAV_ITEMS[0].x)} y={NAV_Y} clickFrame={G.clickHome} frame={frame} color="rgba(78,157,232,0.6)" />
      <Ripple x={navX(NAV_ITEMS[1].x)} y={NAV_Y} clickFrame={G.clickWork} frame={frame} color="rgba(78,157,232,0.6)" />
      <Ripple x={navX(NAV_ITEMS[2].x)} y={NAV_Y} clickFrame={G.clickAbout} frame={frame} color="rgba(78,157,232,0.6)" />
      <Ripple x={CTA.x} y={CTA.y} clickFrame={G.press} frame={frame} color="rgba(78,157,232,0.6)" />
      {cursorOpacity > 0 && (
        <Cursor x={pos.x} y={pos.y} press={pressDip} opacity={cursorOpacity} tone="dark" />
      )}
    </AbsoluteFill>
  );
};
