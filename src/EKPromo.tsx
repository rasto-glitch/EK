import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./components/Background";
import { Grain } from "./components/Grain";
import { Music } from "./components/Music";
import { AR, EN, KU, LocaleProvider } from "./locales";
import { BrandReveal } from "./scenes/BrandReveal";
import { CodedThis } from "./scenes/CodedThis";
import { CTA } from "./scenes/CTA";
import { Hook } from "./scenes/Hook";
import { ProcessLine } from "./scenes/ProcessLine";
import { ValueCards } from "./scenes/ValueCards";
import { colors, T } from "./theme";

export type EKPromoProps = {
  locale?: "en" | "ar" | "ku";
};

export const EKPromo: React.FC<EKPromoProps> = ({ locale = "en" }) => {
  const L = locale === "ar" ? AR : locale === "ku" ? KU : EN;
  return (
    <LocaleProvider value={L}>
      <AbsoluteFill style={{ backgroundColor: colors.bg, fontFamily: L.fontFamily }}>
        <Background />
        <Sequence from={T.hook.from} durationInFrames={T.hook.dur} name="Hook">
          <Hook />
        </Sequence>
        <Sequence from={T.brand.from} durationInFrames={T.brand.dur} name="Brand reveal">
          <BrandReveal />
        </Sequence>
        <Sequence from={T.cards.from} durationInFrames={T.cards.dur} name="Value cards">
          <ValueCards />
        </Sequence>
        <Sequence from={T.process.from} durationInFrames={T.process.dur} name="Process">
          <ProcessLine />
        </Sequence>
        <Sequence from={T.cta.from} durationInFrames={T.cta.dur} name="CTA">
          <CTA />
        </Sequence>
        <Sequence from={T.coded.from} durationInFrames={T.coded.dur} name="We coded this">
          <CodedThis />
        </Sequence>
        <Grain />
        <Music />
      </AbsoluteFill>
    </LocaleProvider>
  );
};
