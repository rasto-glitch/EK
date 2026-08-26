import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily, SMOOTH } from "../theme";
import { Cursor, Ripple } from "./Cursor";
import { B, clickPulse, CONTENT_Y, cursorPath, FRAME, Waypoint } from "./timings";

// Garish "someone else's site" palette — deliberately off-brand.
const BAD = {
  page: "#FFFFFF",
  chrome: "#E8E8EC",
  text: "#1B1E24",
  dim: "#9AA1AC",
  uglyBlue: "#2B6CB0",
  adA: "#FFD400",
  adB: "#FF3D6E",
};

// Canvas-space click targets (see timings.ts for geometry)
const MENU = { x: 830, y: 384 }; // where Menu WAS before the ad shoved it down
const CONTACT = { x: 290, y: 992 };
const X_MISS = { x: 806, y: 672 };
const X_HIT = { x: 833, y: 648 };
const LINK = { x: 235, y: 1130 };

const PATH: Waypoint[] = [
  { t: B.cursorIn + 4, x: 620, y: 1500 },
  { t: B.adInject + 2, x: MENU.x, y: MENU.y + 4 },
  { t: B.adClick + 8, x: MENU.x, y: MENU.y + 4 },
  { t: B.click1 - 5, x: CONTACT.x, y: CONTACT.y },
  { t: B.popupIn + 2, x: CONTACT.x, y: CONTACT.y },
  { t: B.missClick - 4, x: X_MISS.x, y: X_MISS.y },
  { t: B.missClick + 8, x: X_MISS.x, y: X_MISS.y },
  { t: B.hitClick - 4, x: X_HIT.x, y: X_HIT.y },
  { t: B.popupGone + 2, x: X_HIT.x, y: X_HIT.y },
  { t: B.linkClick - 4, x: LINK.x, y: LINK.y },
];

const Bar: React.FC<{ w: number; h?: number; c?: string; mt?: number }> = ({
  w,
  h = 22,
  c = "#D6DAE1",
  mt = 0,
}) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: c, marginTop: mt }} />
);

export const BadSite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- label: big intro → small top chip -----------------------------------
  const bigLabelIn = spring({ frame: frame - 4, fps, config: SMOOTH });
  const bigLabelOut = interpolate(frame, [B.label - 8, B.label + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipIn = spring({ frame: frame - B.label, fps, config: SMOOTH });
  const browserIn = spring({ frame: frame - B.browserIn, fps, config: SMOOTH });

  // ---- beat state -----------------------------------------------------------
  const spinnerVisible = frame >= B.spinnerStart && frame < B.spinnerEnd;
  // Janky stepped rotation — 45° jumps with an extra stall near the end.
  const spinnerStall = frame > B.spinnerEnd - 30 && frame < B.spinnerEnd - 8;
  const spinnerAngle = spinnerStall
    ? Math.floor((B.spinnerEnd - 30) / 7) * 45
    : Math.floor(frame / 7) * 45;
  const contentVisible = frame >= B.contentPop && frame < B.cut404;
  const shifted = frame >= B.shift; // hero image popped in, text shoved down
  const adVisible = frame >= B.adInject && frame < B.cut404;
  const popupVisible = frame >= B.popupIn && frame < B.popupGone;
  const is404 = frame >= B.cut404;

  const popupPop = spring({
    frame: frame - B.popupIn,
    fps,
    config: { damping: 14, stiffness: 180 }, // cheap, slightly bouncy — on purpose
    durationInFrames: 20,
  });
  // popup wobbles when the ✕ click misses
  const popupWobble =
    frame >= B.missClick && frame < B.missClick + 12
      ? Math.sin((frame - B.missClick) * 1.6) * 7 * (1 - (frame - B.missClick) / 12)
      : 0;

  // ---- cursor ---------------------------------------------------------------
  const pos = cursorPath(frame, PATH);
  const shakeAmp =
    frame >= B.shakeStart && frame < B.shakeEnd
      ? 11 * (1 - (frame - B.shakeStart) / (B.shakeEnd - B.shakeStart))
      : 0;
  const cx = pos.x + Math.sin(frame * 2.2) * shakeAmp;
  const cy = pos.y + Math.cos(frame * 3.1) * shakeAmp * 0.35;
  const press = Math.max(
    clickPulse(frame, B.adClick),
    clickPulse(frame, B.click1),
    clickPulse(frame, B.click2),
    clickPulse(frame, B.click3),
    clickPulse(frame, B.missClick),
    clickPulse(frame, B.hitClick),
    clickPulse(frame, B.linkClick)
  );
  const cursorOpacity = interpolate(frame, [B.cursorIn, B.cursorIn + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* big intro label */}
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
          opacity: bigLabelIn * bigLabelOut,
          transform: `translateY(${(1 - bigLabelIn) * 30}px)`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 76,
              letterSpacing: "-0.03em",
              color: colors.text,
            }}
          >
            People&apos;s website
          </div>
          <div
            style={{
              margin: "26px auto 0",
              width: 210,
              height: 3,
              borderRadius: 2,
              background: "#E5484D",
              boxShadow: "0 0 16px rgba(229,72,77,0.6)",
            }}
          />
        </div>
      </div>

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
            border: "1.5px solid rgba(255,255,255,0.14)",
            background: "rgba(19,19,24,0.8)",
            fontFamily,
            fontWeight: 500,
            fontSize: 30,
            color: colors.textDim,
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 7,
              background: "#E5484D",
              boxShadow: "0 0 10px rgba(229,72,77,0.7)",
            }}
          />
          People&apos;s website
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
          border: "1.5px solid rgba(255,255,255,0.12)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          opacity: browserIn,
          transform: `translateY(${(1 - browserIn) * 60}px)`,
        }}
      >
        {/* chrome bar */}
        <div
          style={{
            height: FRAME.chrome,
            background: BAD.chrome,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 26px",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 17, height: 17, borderRadius: 9, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 16,
              flex: 1,
              height: 40,
              borderRadius: 20,
              background: "#F7F7FA",
              border: "1px solid #D9DCE3",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              fontFamily,
              fontSize: 24,
              color: BAD.dim,
            }}
          >
            www.peoples-website.com
          </div>
        </div>

        {/* page */}
        <div
          style={{
            position: "relative",
            height: FRAME.height - FRAME.chrome,
            background: BAD.page,
            overflow: "hidden",
          }}
        >
          {is404 ? (
            // ------------------------- 404 — hard cut -------------------------
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
              }}
            >
              <div
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 230,
                  letterSpacing: "-0.04em",
                  color: BAD.text,
                  lineHeight: 1,
                }}
              >
                404
              </div>
              <div
                style={{
                  marginTop: 28,
                  fontFamily,
                  fontWeight: 500,
                  fontSize: 40,
                  color: BAD.dim,
                }}
              >
                Page not found
              </div>
            </div>
          ) : (
            <>
              {/* banner ad — loads late, shoves everything down */}
              {adVisible && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    background: `repeating-linear-gradient(45deg, ${BAD.adA} 0 40px, ${BAD.adB} 40px 80px)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 36,
                    color: "#1B1E24",
                    transform: `scale(${1 + clickPulse(frame, B.adClick) * 0.04})`,
                  }}
                >
                  ★ HOT DEALS — CLICK NOW ★
                </div>
              )}

              {/* everything below shifts when the ad injects */}
              <div style={{ position: "absolute", inset: 0, top: adVisible ? 100 : 0 }}>
                {/* nav */}
                <div
                  style={{
                    height: 96,
                    borderBottom: "1px solid #E3E6EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 40px",
                  }}
                >
                  <div style={{ width: 130, height: 34, borderRadius: 6, background: "#C7CCD4" }} />
                  <div
                    style={{
                      width: 150,
                      height: 52,
                      borderRadius: 8,
                      border: "2px solid #C7CCD4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily,
                      fontWeight: 500,
                      fontSize: 27,
                      color: BAD.text,
                    }}
                  >
                    Menu
                  </div>
                </div>

                {contentVisible && (
                  <div style={{ padding: "0 40px" }}>
                    {/* hero image pops in late → classic layout shift */}
                    {shifted && (
                      <div
                        style={{
                          marginTop: 28,
                          height: 360,
                          borderRadius: 10,
                          background:
                            "linear-gradient(160deg, #C9CFD8 0%, #AEB6C2 60%, #99A2B0 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="90" height="90" fill="none" stroke="#7E8794" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    <Bar w={520} h={30} c="#B9BFC9" mt={34} />
                    <Bar w={640} mt={20} />
                    <Bar w={580} mt={14} />
                    <Bar w={380} mt={14} />

                    {/* dead Contact button */}
                    <div
                      style={{
                        marginTop: 44,
                        width: 260,
                        height: 74,
                        borderRadius: 8,
                        background: BAD.uglyBlue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily,
                        fontWeight: 700,
                        fontSize: 30,
                        color: "#FFFFFF",
                      }}
                    >
                      Contact
                    </div>

                    {/* the fateful link */}
                    <div
                      style={{
                        marginTop: 56,
                        fontFamily,
                        fontWeight: 500,
                        fontSize: 30,
                        color: BAD.uglyBlue,
                        textDecoration: "underline",
                      }}
                    >
                      See our work →
                    </div>
                  </div>
                )}

                {/* spinner (before content) */}
                {spinnerVisible && (
                  <div
                    style={{
                      position: "absolute",
                      top: 420,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 74,
                        height: 74,
                        borderRadius: "50%",
                        border: "8px solid #E3E6EB",
                        borderTopColor: BAD.uglyBlue,
                        transform: `rotate(${spinnerAngle}deg)`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* popup ad */}
              {popupVisible && (
                <>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
                  <div
                    style={{
                      position: "absolute",
                      left: 110 + popupWobble,
                      top: 300,
                      width: 660,
                      height: 480,
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${BAD.adB} 0%, ${BAD.adA} 100%)`,
                      boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
                      transform: `scale(${0.7 + popupPop * 0.3})`,
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
                        fontSize: 84,
                        color: "#FFFFFF",
                        textShadow: "0 4px 0 rgba(0,0,0,0.25)",
                        transform: `rotate(-4deg)`,
                      }}
                    >
                      50% OFF!!!
                    </div>
                    <div
                      style={{
                        marginTop: 18,
                        fontFamily,
                        fontWeight: 700,
                        fontSize: 34,
                        color: "#1B1E24",
                      }}
                    >
                      LIMITED TIME ONLY
                    </div>
                    {/* the tiny ✕ */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 12,
                        width: 30,
                        height: 30,
                        borderRadius: 6,
                        background: "rgba(0,0,0,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily,
                        fontWeight: 700,
                        fontSize: 20,
                        color: "#FFFFFF",
                      }}
                    >
                      ✕
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* click ripples */}
      <Ripple x={MENU.x} y={MENU.y} clickFrame={B.adClick} frame={frame} />
      <Ripple x={CONTACT.x} y={CONTACT.y} clickFrame={B.click1} frame={frame} />
      <Ripple x={CONTACT.x} y={CONTACT.y} clickFrame={B.click2} frame={frame} />
      <Ripple x={CONTACT.x} y={CONTACT.y} clickFrame={B.click3} frame={frame} />
      <Ripple x={X_MISS.x} y={X_MISS.y} clickFrame={B.missClick} frame={frame} />
      <Ripple x={X_HIT.x} y={X_HIT.y} clickFrame={B.hitClick} frame={frame} />
      <Ripple x={LINK.x} y={LINK.y} clickFrame={B.linkClick} frame={frame} />

      {/* cursor */}
      {frame >= B.cursorIn && (
        <Cursor x={cx} y={cy} press={press} opacity={cursorOpacity} tone="light" />
      )}
    </AbsoluteFill>
  );
};
