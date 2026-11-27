import { Box } from "@chakra-ui/react"
import { useState } from "react"
import { useSettings } from "../lib/settings"
import { PageHeader } from "../components/ui"
import { Row } from "./Profile"
import { useTranslation } from "react-i18next"
import { LANGUAGES } from "../i18n/languages"
import { countryName } from "../i18n/languages"
import { LanguageSheet, CountrySheet } from "../components/Pickers"
import { PillButton } from "../components/ui"

import { LuLanguages, LuGlobe } from "react-icons/lu"

export function EditProfile() {
    const { t } = useTranslation();
    const { language, country } = useSettings();
    const [sheet, setSheet] = useState<"lang" | "country" | null>(null);

    return (
        <>
            <Box pt="var(--tg-content-safe-area-inset-top)">
                <PageHeader title={"Изменить профиль"} fallback="/profile" paddingTop="0" />
                <Box bg="surface" borderRadius="22px" overflow="hidden" mb="4">
                    <Row
                        icon={<LuLanguages size={20} />}
                        label={t("profile.language")}
                        value={LANGUAGES.find((l) => l.code === language)?.name}
                        onClick={() => setSheet("lang")}
                    />
                    <Row
                        icon={<LuGlobe size={20} />}
                        label={t("profile.country")}
                        value={countryName(country, language)}
                        onClick={() => setSheet("country")}
                    />
                </Box>
            </Box>

            <PillButton type="submit" tone="signal" full minH="54px">
                Save
            </PillButton>

            <LanguageSheet open={sheet === "lang"} onClose={() => setSheet(null)} />
            <CountrySheet open={sheet === "country"} onClose={() => setSheet(null)} />
        </>
    )
}