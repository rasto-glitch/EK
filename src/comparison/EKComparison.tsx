import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "../components/Background";
import { Grain } from "../components/Grain";
import { colors } from "../theme";
import { BadSite } from "./BadSite";
import { CMP_AR, CMP_EN, CmpProvider } from "./copy";
import { EndCard } from "./EndCard";
import { GoodSite } from "./GoodSite";
import { Rebuild } from "./Rebuild";
import { CT } from "./timings";

// Bad website vs. EK website — frustration acted out, never described.
export const EKComparison: React.FC<{ locale?: "en" | "ar" }> = ({ locale = "en" }) => {
  const c = locale === "ar" ? CMP_AR : CMP_EN;
  return (
    <CmpProvider value={c}>
      <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: c.fontFamily }}>
      <Background />
      <Sequence from={CT.bad.from} durationInFrames={CT.bad.dur} name="People's website">
        <BadSite />
      </Sequence>
      <Sequence from={CT.rebuild.from} durationInFrames={CT.rebuild.dur} name="Rebuild">
        <Rebuild />
      </Sequence>
      <Sequence from={CT.good.from} durationInFrames={CT.good.dur} name="Your website">
        <GoodSite />
      </Sequence>
      <Sequence from={CT.end.from} durationInFrames={CT.end.dur} name="End card">
        <EndCard />
      </Sequence>
        <Grain />
      </AbsoluteFill>
    </CmpProvider>
  );
};
