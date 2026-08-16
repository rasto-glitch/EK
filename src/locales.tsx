import { createContext, useContext } from "react";
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { fontFamily as interFamily } from "./theme";

// Arabic UI sans. Latin glyphs (the email address) fall back to Inter.
const cairo = loadCairo("normal", { weights: ["300", "500", "700", "800"] });

// Kurdish: the NRT family from public/fonts (Reg = 400, Bd = 700). Weights
// 300/500 resolve to Reg and 800 to Bd via CSS font matching.
loadLocalFont({ family: "NRT", url: staticFile("fonts/NRT-Reg.ttf"), weight: "400" });
loadLocalFont({ family: "NRT", url: staticFile("fonts/NRT-Bd.ttf"), weight: "700" });

export type PromoCopy = {
  hookWords: string[];
  hookAccentIndex: number;
  tagPre: string;
  tagBold: string;
  cards: { title: string; sub: string }[];
  processPre: string;
  processAccent: string;
  steps: [string, string, string];
  ctaHeading: string;
  email: string;
  site: string;
};

export type Locale = {
  code: "en" | "ar" | "ku";
  rtl: boolean;
  fontFamily: string;
  copy: PromoCopy;
};

export const EN: Locale = {
  code: "en",
  rtl: false,
  fontFamily: interFamily,
  copy: {
    hookWords: ["Your", "business", "deserves", "a", "better", "website."],
    hookAccentIndex: 4,
    tagPre: "Websites & apps,",
    tagBold: "built right.",
    cards: [
      { title: "Fast, modern websites", sub: "Launch in weeks, not months." },
      { title: "iOS & Android apps", sub: "One codebase, both stores." },
      { title: "Designed for your customers", sub: "Simple, fast, easy to love." },
    ],
    processPre: "From idea to launch —",
    processAccent: "one team, one price.",
    steps: ["Design", "Build", "Launch"],
    ctaHeading: "Ready to start?",
    email: "contact@elkurdi.co",
    site: "elkurdi.co",
  },
};

export const AR: Locale = {
  code: "ar",
  rtl: true,
  fontFamily: `${cairo.fontFamily}, ${interFamily}`,
  copy: {
    hookWords: ["عملك", "يستحق", "موقعاً", "أفضل."],
    hookAccentIndex: 3,
    tagPre: "مواقع وتطبيقات،",
    tagBold: "مبنية بإتقان.",
    cards: [
      { title: "مواقع سريعة وعصرية", sub: "أطلقها خلال أسابيع، لا أشهر." },
      { title: "تطبيقات iOS و Android", sub: "كود واحد، لكلا المتجرين." },
      { title: "مصمّمة لعملائك", sub: "بسيطة، سريعة، يحبّها الجميع." },
    ],
    processPre: "من الفكرة إلى الإطلاق —",
    processAccent: "فريق واحد، سعر واحد.",
    steps: ["التصميم", "التطوير", "الإطلاق"],
    ctaHeading: "مستعد للبدء؟",
    email: "contact@elkurdi.co",
    site: "elkurdi.co",
  },
};

export const KU: Locale = {
  code: "ku",
  rtl: true,
  fontFamily: `NRT, ${cairo.fontFamily}, ${interFamily}`,
  copy: {
    hookWords: ["بزنسەکەت", "شایانی", "ماڵپەڕێکی", "باشترە."],
    hookAccentIndex: 3,
    tagPre: "ماڵپەڕ و ئەپ،",
    tagBold: "بە باشی دروستکراون.",
    cards: [
      { title: "ماڵپەڕی خێرا و مۆدێرن", sub: "بە هەفتە ئامادە دەبێت، نەک بە مانگ." },
      { title: "ئەپی iOS و Android", sub: "یەک کۆد، بۆ هەردوو ستۆر." },
      { title: "بۆ کڕیارەکانت دیزاینکراوە", sub: "سادە و خێرا و دڵگیر." },
    ],
    processPre: "لە بیرۆکەوە تا بڵاوکردنەوە —",
    processAccent: "یەک تیم، یەک نرخ.",
    steps: ["دیزاین", "دروستکردن", "بڵاوکردنەوە"],
    ctaHeading: "ئامادەیت دەست پێبکەیت؟",
    email: "contact@elkurdi.co",
    site: "elkurdi.co",
  },
};

const LocaleContext = createContext<Locale>(EN);
export const LocaleProvider = LocaleContext.Provider;
export const useLocale = () => useContext(LocaleContext);
