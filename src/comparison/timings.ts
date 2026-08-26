import { Easing, interpolate } from "remotion";

// ---------------------------------------------------------------------------
// EKComparison — beat timings (frames @ 30fps, 900 total = 30s).
// Scene-local frames unless noted. Tweak pacing here.
// ---------------------------------------------------------------------------
export const CT = {
  bad: { from: 0, dur: 450 }, //      0 – 15s  "People's website"
  rebuild: { from: 450, dur: 75 }, // 15 – 17.5s glitch → reassembly
  good: { from: 525, dur: 225 }, //   17.5 – 25s "Your website"
  end: { from: 750, dur: 300 }, //    25 – 35s  end card (long, unhurried close)
  total: 1050,
};

// Scene 1 beats (local frames)
export const B = {
  label: 52, // big label fades into top chip around here
  browserIn: 56,
  spinnerStart: 70,
  spinnerEnd: 128,
  contentPop: 130,
  shift: 146, // layout shift: hero image pops in, pushes text down
  cursorIn: 152,
  adInject: 197, // banner ad loads, nav jumps down right before the click
  adClick: 203,
  click1: 244, // dead Contact button
  click2: 266,
  click3: 282,
  shakeStart: 288,
  shakeEnd: 300,
  popupIn: 304,
  missClick: 342, // tiny ✕, first click misses
  hitClick: 364,
  popupGone: 368,
  linkClick: 394,
  cut404: 404, // hard cut, held to end of scene
};

// Scene 3 beats (local frames) — real tab navigation: each click swaps pages
export const G = {
  chipIn: 4,
  loadStart: 10, // Home assembles immediately — no waiting
  clickHome: 76,
  clickWork: 104, // → Work page slides in
  clickAbout: 134, // → About page (holds the Contact button)
  press: 172, // Contact press on the About page
  checkDraw: 182,
  scrollStart: 196,
  scrollEnd: 222,
};

// Scene 4 beats (local frames, 300 total — the close takes its time)
export const E = {
  headlineIn: 6,
  shrinkStart: 52,
  shrinkEnd: 68,
  typeStart: 70,
  typeEnd: 150, // slower, readable typing
  logoIn: 160,
  contactsIn: 185,
};

// Browser frame geometry (canvas px, shared by both sites)
export const FRAME = { left: 100, top: 250, width: 880, height: 1250, chrome: 84 };
export const CONTENT_X = FRAME.left;
export const CONTENT_Y = FRAME.top + FRAME.chrome;

// ---------------------------------------------------------------------------
// Cursor path helper: piecewise ease-in-out between waypoints.
// ---------------------------------------------------------------------------
export type Waypoint = { t: number; x: number; y: number };

export const cursorPath = (f: number, keys: Waypoint[]): { x: number; y: number } => {
  if (f <= keys[0].t) return { x: keys[0].x, y: keys[0].y };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f >= a.t && f < b.t) {
      const p = interpolate(f, [a.t, b.t], [0, 1], {
        easing: Easing.inOut(Easing.cubic),
      });
      return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y };
};

// Click pulse: 0→1→0 over ~10 frames after the click frame.
export const clickPulse = (f: number, clickFrame: number): number => {
  const d = f - clickFrame;
  if (d < 0 || d > 10) return 0;
  return d < 4 ? d / 4 : (10 - d) / 6;
};
