import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useLocale } from "../locales";
import { colors, SAFE, SMOOTH, T } from "../theme";

// ---------------------------------------------------------------------------
// 6–13s — three value cards, one at a time. Each: mockup (built from divs),
// icon chip, headline, sub-caption. 70 frames per card.
// ---------------------------------------------------------------------------

type Stagger = (delay: number, dur?: number) => number;

// --- Mockup 1: abstract browser window ------------------------------------
const BrowserMockup: React.FC<{ st: Stagger }> = ({ st }) => (
  <div
    style={{
      width: 700,
      height: 500,
      borderRadius: 28,
      background: colors.surface,
      border: `1.5px solid ${colors.border}`,
      boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
      overflow: "hidden",
      transform: `translateY(${(1 - st(0)) * 60}px)`,
      opacity: st(0),
    }}
  >
    {/* chrome bar */}
    <div
      style={{
        height: 68,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 28px",
        borderBottom: `1.5px solid ${colors.border}`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: "rgba(255,255,255,0.18)",
            opacity: st(4 + i * 2),
          }}
        />
      ))}
      <div
        style={{
          marginLeft: 18,
          height: 30,
          borderRadius: 15,
          background: "rgba(255,255,255,0.07)",
          width: 320 * st(8),
        }}
      />
    </div>
    {/* hero block */}
    <div style={{ padding: 32 }}>
      <div
        style={{
          height: 170,
          borderRadius: 18,
          background: `linear-gradient(120deg, ${colors.accentDeep} 0%, ${colors.accent} 100%)`,
          opacity: 0.9 * st(10),
          transform: `scaleX(${0.9 + st(10) * 0.1})`,
        }}
      />
      <div
        style={{
          marginTop: 26,
          height: 26,
          borderRadius: 13,
          background: "rgba(255,255,255,0.16)",
          width: 420 * st(15),
        }}
      />
      <div
        style={{
          marginTop: 16,
          height: 26,
          borderRadius: 13,
          background: "rgba(255,255,255,0.09)",
          width: 300 * st(18),
        }}
      />
      <div
        style={{
          marginTop: 30,
          height: 56,
          width: 190,
          borderRadius: 28,
          background: colors.accent,
          opacity: st(22),
          transform: `scale(${0.9 + st(22) * 0.1})`,
        }}
      />
    </div>
  </div>
);

// --- Mockup 2: abstract phone with app list --------------------------------
const PhoneMockup: React.FC<{ st: Stagger }> = ({ st }) => (
  <div
    style={{
      width: 380,
      height: 560,
      borderRadius: 56,
      background: colors.surface,
      border: `1.5px solid ${colors.border}`,
      boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
      overflow: "hidden",
      position: "relative",
      transform: `translateY(${(1 - st(0)) * 60}px)`,
      opacity: st(0),
    }}
  >
    {/* notch */}
    <div
      style={{
        position: "absolute",
        top: 18,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        height: 26,
        borderRadius: 13,
        background: "rgba(0,0,0,0.6)",
        border: `1px solid ${colors.border}`,
      }}
    />
    <div style={{ padding: "72px 26px 0" }}>
      <div
        style={{
          height: 22,
          width: 150 * st(6),
          borderRadius: 11,
          background: "rgba(255,255,255,0.2)",
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            marginTop: 22,
            height: 76,
            borderRadius: 20,
            background: i === 0 ? "rgba(78,157,232,0.2)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${i === 0 ? "rgba(78,157,232,0.4)" : colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 20px",
            opacity: st(10 + i * 4),
            transform: `translateY(${(1 - st(10 + i * 4)) * 26}px)`,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: i === 0 ? colors.accent : "rgba(255,255,255,0.14)",
            }}
          />
          <div
            style={{
              height: 16,
              width: 150,
              borderRadius: 8,
              background: "rgba(255,255,255,0.14)",
            }}
          />
        </div>
      ))}
    </div>
    {/* tab bar */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 74,
        borderTop: `1.5px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        opacity: st(24),
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: i === 1 ? colors.accent : "rgba(255,255,255,0.2)",
          }}
        />
      ))}
    </div>
  </div>
);

// --- Mockup 3: abstract phone with chat bubbles ----------------------------
const ChatMockup: React.FC<{ st: Stagger }> = ({ st }) => (
  <div
    style={{
      width: 380,
      height: 560,
      borderRadius: 56,
      background: colors.surface,
      border: `1.5px solid ${colors.border}`,
      boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
      overflow: "hidden",
      transform: `translateY(${(1 - st(0)) * 60}px)`,
      opacity: st(0),
    }}
  >
    <div
      style={{
        padding: "60px 26px 0",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {[
        { w: 210, left: true, d: 6 },
        { w: 240, left: false, d: 12, accent: true },
        { w: 170, left: true, d: 18 },
        { w: 220, left: false, d: 24, accent: true },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            alignSelf: b.left ? "flex-start" : "flex-end",
            width: b.w,
            height: 62,
            borderRadius: 26,
            borderBottomLeftRadius: b.left ? 8 : 26,
            borderBottomRightRadius: b.left ? 26 : 8,
            background: b.accent ? colors.accent : "rgba(255,255,255,0.1)",
            opacity: (b.accent ? 0.92 : 1) * st(b.d),
            transform: `translateY(${(1 - st(b.d)) * 24}px) scale(${0.94 + st(b.d) * 0.06})`,
          }}
        />
      ))}
      {/* typing indicator */}
      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          gap: 10,
          padding: "20px 24px",
          borderRadius: 26,
          borderBottomLeftRadius: 8,
          background: "rgba(255,255,255,0.07)",
          opacity: st(30),
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "rgba(255,255,255,0.4)",
              opacity: 0.4 + 0.6 * st(32 + i * 3),
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// --- Icon chips (simple shapes only) ---------------------------------------
const IconChip: React.FC<{ kind: "web" | "app" | "people" }> = ({ kind }) => (
  <div
    style={{
      width: 72,
      height: 72,
      borderRadius: 20,
      background: "rgba(78,157,232,0.14)",
      border: `1.5px solid rgba(78,157,232,0.4)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {kind === "web" && (
      <div
        style={{
          width: 38,
          height: 30,
          borderRadius: 6,
          border: `3px solid ${colors.accent}`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 3,
            width: 12,
            height: 3,
            borderRadius: 2,
            background: colors.accent,
          }}
        />
      </div>
    )}
    {kind === "app" && (
      <div
        style={{
          width: 24,
          height: 40,
          borderRadius: 7,
          border: `3px solid ${colors.accent}`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 3,
        }}
      >
        <div
          style={{ width: 8, height: 3, borderRadius: 2, background: colors.accent }}
        />
      </div>
    )}
    {kind === "people" && (
      <div style={{ display: "flex", gap: 5 }}>
        {[14, 18, 14].map((s, i) => (
          <div
            key={i}
            style={{
              width: s,
              height: s,
              borderRadius: s / 2,
              background: colors.accent,
              opacity: i === 1 ? 1 : 0.55,
              alignSelf: "flex-end",
            }}
          />
        ))}
      </div>
    )}
  </div>
);

// --- Card data (text comes from the active locale) --------------------------
const CARDS = [
  { icon: "web" as const, Mockup: BrowserMockup },
  { icon: "app" as const, Mockup: PhoneMockup },
  { icon: "people" as const, Mockup: ChatMockup },
];

const Card: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - index * T.cardDur;
  const { icon, Mockup } = CARDS[index];
  const L = useLocale();
  const { title, sub } = L.copy.cards[index];
  // Mirror the swipe direction for RTL: cards travel left-to-right.
  const m = L.rtl ? -1 : 1;

  // Everything in this card staggers off this helper.
  const st: Stagger = (delay, dur = 32) =>
    spring({ frame: local - delay, fps, config: SMOOTH, durationInFrames: dur });

  // Tab-like motion: first card rises in with the scene; the others swipe in
  // from the right. Cards leave to the left; the last one just fades out.
  const enter = spring({
    frame: local,
    fps,
    config: SMOOTH,
    durationInFrames: index === 0 ? 38 : 34,
  });
  const exitP = interpolate(local, [T.cardDur - 16, T.cardDur - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const isFirst = index === 0;
  const isLast = index === CARDS.length - 1;
  const x = ((isFirst ? 0 : (1 - enter) * 560) + (isLast ? 0 : -exitP * 560)) * m;
  const y = (isFirst ? (1 - enter) * 90 : 0) + (isLast ? -exitP * 26 : 0);

  if (local < 0 || local >= T.cardDur) return null;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom - 40,
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
        opacity: Math.min(enter * 1.4, 1) * (1 - exitP),
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <Mockup st={st} />
      <div
        style={{
          marginTop: 74,
          width: "100%",
          maxWidth: 820,
          display: "flex",
          gap: 28,
          alignItems: "center",
          direction: L.rtl ? "rtl" : "ltr",
          opacity: st(8),
          transform: `translateY(${(1 - st(8)) * 30}px)`,
        }}
      >
        <IconChip kind={icon} />
        <div>
          <div
            style={{
              fontFamily: L.fontFamily,
              fontWeight: 700,
              fontSize: 58,
              letterSpacing: L.rtl ? undefined : "-0.025em",
              color: colors.text,
              lineHeight: L.rtl ? 1.5 : 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: L.fontFamily,
              fontWeight: 300,
              fontSize: 34,
              color: colors.textDim,
            }}
          >
            {sub}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Persistent tab indicator: stays on screen for the whole scene; the active
// pill glides from dot to dot as each card swipes past.
const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLocale();

  const fadeIn = spring({ frame: frame - 12, fps, config: SMOOTH });
  const fadeOut = interpolate(frame, [T.cards.dur - 14, T.cards.dur - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 0 → 1 → 2 as the cards change, springing between positions.
  const pos =
    spring({ frame: frame - T.cardDur, fps, config: SMOOTH, durationInFrames: 34 }) +
    spring({ frame: frame - 2 * T.cardDur, fps, config: SMOOTH, durationInFrames: 34 });

  return (
    <div
      style={{
        position: "absolute",
        bottom: SAFE.bottom + 200,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        direction: L.rtl ? "rtl" : "ltr",
        opacity: fadeIn * fadeOut,
      }}
    >
      {[0, 1, 2].map((i) => {
        const proximity = Math.max(0, 1 - Math.abs(pos - i));
        return (
          <div
            key={i}
            style={{
              position: "relative",
              width: 12 + 22 * proximity,
              height: 12,
              borderRadius: 6,
              background: "rgba(255,255,255,0.18)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 6,
                background: colors.accent,
                boxShadow: `0 0 12px ${colors.accentGlow}`,
                opacity: proximity,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const ValueCards: React.FC = () => {
  return (
    <AbsoluteFill>
      <Card index={0} />
      <Card index={1} />
      <Card index={2} />
      <Dots />
    </AbsoluteFill>
  );
};
