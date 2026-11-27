import { COUNTRY_NAMES, type CountryCode } from "../data/countries";

export const LANGUAGES = [
  { code: "eng", name: "English", bcp47: ["en"] },
  { code: "rus", name: "Русский", bcp47: ["ru"] },
  { code: "uzb", name: "Oʻzbekcha", bcp47: ["uz-Latn", "uz"] },
  { code: "kaz", name: "Қазақша", bcp47: ["kk"] },
  { code: "kaa", name: "Qaraqalpaqsha", bcp47: ["kaa", "uz-Latn", "uz"] },
  { code: "kgz", name: "Кыргызча", bcp47: ["ky"] },
  { code: "tjk", name: "Тоҷикӣ", bcp47: ["tg"] },
  { code: "aze", name: "Azərbaycan", bcp47: ["az"] },
  { code: "tkm", name: "Türkmençe", bcp47: ["tk"] },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

export const isLangCode = (v: unknown): v is LangCode =>
  LANGUAGES.some((l) => l.code === v);

export const bcp47 = (code: LangCode): string[] =>
  [...(LANGUAGES.find((l) => l.code === code)?.bcp47 ?? ["en"])];

/** Telegram language_code (ISO 639-1) → app language */
export function fromTelegramLang(code?: string): LangCode {
  const map: Record<string, LangCode> = {
    en: "eng", ru: "rus", uz: "uzb", kk: "kaz", ky: "kgz", tg: "tjk", az: "aze", tk: "tkm",
  };
  return (code && map[code.slice(0, 2).toLowerCase()]) || "eng";
}

/** Sensible default posting country for a language */
export const COUNTRY_FOR_LANG: Record<LangCode, CountryCode> = {
  eng: "UZ", rus: "UZ", uzb: "UZ", kaa: "UZ", kaz: "KZ", kgz: "KG", tjk: "TJ", aze: "AZ", tkm: "TM",
};

export function countryName(country: string, lang: LangCode): string {
  const own = COUNTRY_NAMES[lang]?.[country as CountryCode];
  if (own) return own;
  try {
    return new Intl.DisplayNames(bcp47(lang), { type: "region" }).of(country) ?? country;
  } catch {
    return country;
  }
}

export function formatDate(iso: string, lang: LangCode, withTime = false): string {
  const d = new Date(iso);
  try {
    return new Intl.DateTimeFormat(bcp47(lang), {
      day: "numeric",
      month: "long",
      year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatNumber(v: string | number, lang: LangCode): string {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return String(v);
  try {
    return new Intl.NumberFormat(bcp47(lang)).format(n);
  } catch {
    return String(n);
  }
}
