import { useEffect, useState } from "react";
import { continueRender, delayRender, Img, staticFile } from "remotion";
import { colors, fontFamily } from "../theme";

// ---------------------------------------------------------------------------
// LOGO SLOT: drop your mark at  public/logo.svg  and it is used automatically.
// If the file is missing, a bold "EK" text fallback renders instead.
// ---------------------------------------------------------------------------
export const Logo: React.FC<{ size: number }> = ({ size }) => {
  const [exists, setExists] = useState<boolean | null>(null);
  const [handle] = useState(() => delayRender("check logo.svg"));

  useEffect(() => {
    let alive = true;
    fetch(staticFile("logo.svg"), { method: "HEAD" })
      .then((r) => {
        if (alive) setExists(r.ok);
        continueRender(handle);
      })
      .catch(() => {
        if (alive) setExists(false);
        continueRender(handle);
      });
    return () => {
      alive = false;
    };
  }, [handle]);

  if (exists) {
    return (
      <Img
        src={staticFile("logo.svg")}
        style={{ width: size, height: size, display: "block" }}
      />
    );
  }
  if (exists === false) {
    // Text fallback
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size * 0.18,
          border: `${Math.max(2, size * 0.02)}px solid ${colors.accent}`,
          color: colors.text,
          fontFamily,
          fontWeight: 800,
          fontSize: size * 0.42,
          letterSpacing: "-0.02em",
        }}
      >
        EK
      </div>
    );
  }
  return null; // still checking
};
