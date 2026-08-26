import { createContext, useContext } from "react";
import { AR, EN } from "../locales";

// All visible text in the comparison video, per language. Layout and cursor
// choreography are shared — only strings, fonts, and text direction change.
export type CmpCopy = {
  rtl: boolean;
  fontFamily: string;
  badLabel: string;
  menu: string;
  contact: string;
  seeWork: string;
  hotDeals: string;
  off50: string;
  limited: string;
  notFound: string;
  yourWebsite: string;
  navItems: [string, string, string];
  selectedWork: string;
  contactUs: string;
  messageSent: string;
  headline: string;
  typed: string;
};

export const CMP_EN: CmpCopy = {
  rtl: false,
  fontFamily: EN.fontFamily,
  badLabel: "People's website",
  menu: "Menu",
  contact: "Contact",
  seeWork: "See our work →",
  hotDeals: "★ HOT DEALS — CLICK NOW ★",
  off50: "50% OFF!!!",
  limited: "LIMITED TIME ONLY",
  notFound: "Page not found",
  yourWebsite: "Your website",
  navItems: ["Home", "Work", "About"],
  selectedWork: "Selected work",
  contactUs: "Contact us",
  messageSent: "Message sent",
  headline: "Yours doesn't have to be like theirs.",
  typed: "We coded this video. We can code your website.",
};

export const CMP_AR: CmpCopy = {
  rtl: true,
  fontFamily: AR.fontFamily,
  badLabel: "موقع الآخرين",
  menu: "القائمة",
  contact: "اتصل بنا",
  seeWork: "شاهد أعمالنا ←",
  hotDeals: "★ عروض نارية — اضغط الآن ★",
  off50: "خصم 50%!!!",
  limited: "لفترة محدودة فقط",
  notFound: "الصفحة غير موجودة",
  yourWebsite: "موقعك",
  navItems: ["الرئيسية", "أعمالنا", "من نحن"],
  selectedWork: "أعمال مختارة",
  contactUs: "اتصل بنا",
  messageSent: "تم الإرسال",
  headline: "موقعك لا يجب أن يكون مثل مواقعهم.",
  typed: "برمجنا هذا الفيديو. ونستطيع برمجة موقعك.",
};

const CmpContext = createContext<CmpCopy>(CMP_EN);
export const CmpProvider = CmpContext.Provider;
export const useCmp = () => useContext(CmpContext);
