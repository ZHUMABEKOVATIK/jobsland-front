import { Box } from "@chakra-ui/react"
import { PageHeader } from "../components/ui"
// import { useTranslation } from "react-i18next"

export function EditProfile() {
    // const { t, i18n } = useTranslation();

    return (
        <>
            <Box pt="var(--tg-content-safe-area-inset-top)">
                <PageHeader title={"Изменить профиль"} fallback="/profile" />
                йцу
            </Box>
        </>
    )
}