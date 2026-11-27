import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import eng from "./locales/eng";
import rus from "./locales/rus";
import uzb from "./locales/uzb";
import kaz from "./locales/kaz";
import kaa from "./locales/kaa";
import kgz from "./locales/kgz";
import tjk from "./locales/tjk";
import aze from "./locales/aze";
import tkm from "./locales/tkm";
import { bcp47, type LangCode } from "./languages";

export const resources = {
  eng: { translation: eng },
  rus: { translation: rus },
  uzb: { translation: uzb },
  kaz: { translation: kaz },
  kaa: { translation: kaa },
  kgz: { translation: kgz },
  tjk: { translation: tjk },
  aze: { translation: aze },
  tkm: { translation: tkm },
} as const;

export function initI18n(lng: LangCode) {
  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "eng",
    interpolation: { escapeValue: false },
    returnNull: false,
  });
  document.documentElement.lang = bcp47(lng)[0];
  return i18n;
}

export default i18n;
