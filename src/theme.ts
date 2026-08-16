import { loadFont } from "@remotion/google-fonts/Inter";

// One clean geometric sans for everything. Weights: light / medium / bold / extrabold.
const inter = loadFont("normal", { weights: ["300", "500", "700", "800"] });
export const fontFamily = inter.fontFamily;

// ---------------------------------------------------------------------------
// Colors — accent is the brand steel blue (#5980a6) brightened for video.
// ---------------------------------------------------------------------------
export const colors = {
  bg: "#0A0A0B",
  surface: "#131318",
  border: "rgba(255,255,255,0.09)",
  text: "#F4F6F8",
  textDim: "rgba(244,246,248,0.55)",
  accent: "#4E9DE8",
  accentDeep: "#5980a6",
  accentGlow: "rgba(78,157,232,0.55)",
  orbA: "rgba(78,157,232,0.16)",
  orbB: "rgba(89,128,166,0.13)",
  orbC: "rgba(120,90,200,0.08)",
};

// ---------------------------------------------------------------------------
// TikTok / Reels safe area: UI overlays top + bottom, buttons on the right.
// Keep all TEXT inside these margins (decorative shapes may pass beyond).
// ---------------------------------------------------------------------------
export const SAFE = { top: 120, bottom: 250, left: 90, right: 130 };

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps, 750 total = 25s). Tweak here only.
// ---------------------------------------------------------------------------
export const T = {
  hook: { from: 0, dur: 90 }, //   0.0 – 3.0s
  brand: { from: 90, dur: 135 }, // 3.0 – 7.5s
  cards: { from: 225, dur: 285 }, // 7.5 – 17.0s  (3 × 95 frames)
  cardDur: 95,
  process: { from: 510, dur: 140 }, // 17.0 – 21.7s
  cta: { from: 650, dur: 100 }, //  21.7 – 25.0s
  total: 750,
};

// Non-bouncy, "expensive" spring. Use everywhere.
export const SMOOTH = { damping: 200 } as const;
