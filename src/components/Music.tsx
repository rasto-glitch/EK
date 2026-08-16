import { useEffect, useState } from "react";
import {
  Audio,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
} from "remotion";
import { T } from "../theme";

// Plays public/music.mp3 quietly under the whole video IF the file exists.
// Missing file → renders nothing, no error.
export const Music: React.FC = () => {
  const [exists, setExists] = useState(false);
  const [handle] = useState(() => delayRender("check music.mp3"));

  useEffect(() => {
    let alive = true;
    fetch(staticFile("music.mp3"), { method: "HEAD" })
      .then((r) => {
        if (alive) setExists(r.ok && (r.headers.get("content-type") ?? "").includes("audio"));
        continueRender(handle);
      })
      .catch(() => {
        continueRender(handle);
      });
    return () => {
      alive = false;
    };
  }, [handle]);

  if (!exists) return null;

  return (
    <Audio
      src={staticFile("music.mp3")}
      volume={(f) =>
        interpolate(f, [0, 20, T.total - 45, T.total - 5], [0, 0.3, 0.3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};
