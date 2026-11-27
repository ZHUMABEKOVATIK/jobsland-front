import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import i18n from "../i18n";
import { COUNTRY_FOR_LANG, bcp47, fromTelegramLang, isLangCode, type LangCode } from "../i18n/languages";
import { COUNTRIES, type CountryCode } from "../data/countries";
import { getTelegramUser, paintTelegramChrome, tg } from "./telegram";

export type ThemePref = "system" | "light" | "dark";

interface Settings {
  language: LangCode;
  country: CountryCode;
  theme: ThemePref;
}

interface SettingsCtx extends Settings {
  resolvedTheme: "light" | "dark";
  setLanguage(l: LangCode): void;
  setCountry(c: CountryCode): void;
  setTheme(t: ThemePref): void;
}

const KEY = "jobsland:settings:v1";

export function loadSettings(): Settings {
  let stored: Partial<Settings> = {};
  try {
    stored = JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    /* ignore */
  }
  const language = isLangCode(stored.language)
    ? stored.language
    : fromTelegramLang(getTelegramUser()?.language_code ?? navigator.language);
  const country = COUNTRIES.includes(stored.country as CountryCode)
    ? (stored.country as CountryCode)
    : COUNTRY_FOR_LANG[language];
  const theme: ThemePref = ["light", "dark", "system"].includes(stored.theme as string)
    ? (stored.theme as ThemePref)
    : "system";
  return { language, country, theme };
}

const Ctx = createContext<SettingsCtx | null>(null);

function systemScheme(): "light" | "dark" {
  if (tg?.initData) return tg.colorScheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function SettingsProvider({ initial, children }: { initial: Settings; children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(initial);
  const [system, setSystem] = useState<"light" | "dark">(systemScheme);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  // Follow Telegram / OS colour scheme changes
  useEffect(() => {
    const update = () => setSystem(systemScheme());
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener("change", update);
    tg?.onEvent("themeChanged", update);
    return () => {
      mq?.removeEventListener("change", update);
      tg?.offEvent("themeChanged", update);
    };
  }, []);

  const resolvedTheme = settings.theme === "system" ? system : settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("light", resolvedTheme === "light");
    root.style.colorScheme = resolvedTheme;
    const canvas = resolvedTheme === "dark" ? "#14121C" : "#EEF0F7";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", canvas);
    paintTelegramChrome(canvas);
  }, [resolvedTheme]);

  useEffect(() => {
    i18n.changeLanguage(settings.language);
    document.documentElement.lang = bcp47(settings.language)[0];
  }, [settings.language]);

  const setLanguage = useCallback((language: LangCode) => setSettings((s) => ({ ...s, language })), []);
  const setCountry = useCallback((country: CountryCode) => setSettings((s) => ({ ...s, country })), []);
  const setTheme = useCallback((theme: ThemePref) => setSettings((s) => ({ ...s, theme })), []);

  const value = useMemo(
    () => ({ ...settings, resolvedTheme, setLanguage, setCountry, setTheme }),
    [settings, resolvedTheme, setLanguage, setCountry, setTheme],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
