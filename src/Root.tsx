import { Composition } from "remotion";
import { EKPromo } from "./EKPromo";
import { FPS, HEIGHT, T, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EKPromo"
        component={EKPromo}
        durationInFrames={T.total}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ locale: "en" as const }}
      />
      <Composition
        id="EKPromoAr"
        component={EKPromo}
        durationInFrames={T.total}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ locale: "ar" as const }}
      />
      <Composition
        id="EKPromoKu"
        component={EKPromo}
        durationInFrames={T.total}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ locale: "ku" as const }}
      />
    </>
  );
};
