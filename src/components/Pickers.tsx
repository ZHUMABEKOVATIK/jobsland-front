import { useTranslation } from "react-i18next";
import { COUNTRIES, type CountryCode } from "../data/countries";
import { LANGUAGES, countryName, type LangCode } from "../i18n/languages";
import { useSettings } from "../lib/settings";
import { haptic } from "../lib/telegram";
import { OptionList, Sheet } from "./Sheet";

export function CountrySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { country, setCountry, language } = useSettings();
  return (
    <Sheet open={open} onClose={onClose} title={t("profile.chooseCountry")}>
      <OptionList<CountryCode>
        label={t("profile.chooseCountry")}
        value={country}
        onChange={(c) => {
          haptic.select();
          setCountry(c);
          onClose();
        }}
        options={COUNTRIES.map((c) => ({ value: c, label: countryName(c, language), badge: c }))}
      />
    </Sheet>
  );
}

export function LanguageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettings();
  return (
    <Sheet open={open} onClose={onClose} title={t("profile.chooseLanguage")}>
      <OptionList<LangCode>
        label={t("profile.chooseLanguage")}
        value={language}
        onChange={(l) => {
          haptic.select();
          setLanguage(l);
          onClose();
        }}
        options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
      />
    </Sheet>
  );
}
