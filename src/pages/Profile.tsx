import { Box, Flex, Heading, Image, Text, chakra } from "@chakra-ui/react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuChevronRight, LuGlobe, LuLanguages, LuLifeBuoy, LuSunMoon } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { CountrySheet, LanguageSheet } from "../components/Pickers";
import { SegmentedControl, STATUS_STYLE } from "../components/posts";
import { LANGUAGES, countryName } from "../i18n/languages";
import { listPosts, type Post } from "../lib/api";
import { useSettings, type ThemePref } from "../lib/settings";
import { haptic, openExternal } from "../lib/telegram";
import { SUPPORT_URL, useCurrentUser } from "../lib/user";

export function Profile() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const { language, country, theme, setTheme } = useSettings();
  const [sheet, setSheet] = useState<"lang" | "country" | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    listPosts().then(setPosts, () => setPosts([]));
  }, []);

  const stats = [
    { key: "total", label: t("profile.statTotal"), value: posts?.length, color: "ink" },
    ...(["approved", "in_review", "rejected"] as const).map((s) => ({
      key: s,
      label: t(`status.${s}`),
      value: posts?.filter((p) => p.status === s).length,
      color: STATUS_STYLE[s].fg,
    })),
  ];

  return (
    <>
      <Flex direction="column" align="center" textAlign="center" pt="4" mb="6">
        <Image
          src={user.avatar}
          alt=""
          boxSize="92px"
          borderRadius="full"
          objectFit="cover"
          bg="surfaceMuted"
          outline="3px solid"
          outlineColor="surface"
        />
        <Heading as="h1" mt="3" fontSize="22px" fontWeight="700" letterSpacing="-0.01em">
          {user.fullName || t("profile.title")}
        </Heading>
        {user.username && (
          <Text color="inkMuted" fontSize="15px">
            @{user.username}
          </Text>
        )}
      </Flex>

      <Box bg="surface" borderRadius="22px" overflow="hidden" mb="4">
        <Row icon={<MdEdit size={20} />} label={"Изменить профиль"} onClick={() => navigate("/edit-profile")} />
      </Box>

      <Flex bg="surface" borderRadius="22px" mb="4" py="3">
        {stats.map((s, i) => (
          <Box key={s.key} flex="1" textAlign="center" borderLeft={i ? "1px solid" : "none"} borderColor="line" px="1">
            <Text fontFamily="heading" fontWeight="700" fontSize="20px" color={s.color}>
              {s.value ?? "–"}
            </Text>
            <Text fontSize="12px" color="inkMuted" truncate>
              {s.label}
            </Text>
          </Box>
        ))}
      </Flex>

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

      <Box bg="surface" borderRadius="22px" p="4" mb="4">
        <Flex align="center" gap="3" mb="3">
          <RowIcon>
            <LuSunMoon size={20} />
          </RowIcon>
          <Text fontWeight="500">{t("profile.appearance")}</Text>
        </Flex>
        <SegmentedControl<ThemePref>
          label={t("profile.appearance")}
          value={theme}
          onChange={(v) => {
            haptic.select();
            setTheme(v);
          }}
          items={(["system", "light", "dark"] as const).map((v) => ({ value: v, label: t(`profile.themes.${v}`) }))}
        />
      </Box>

      <Box bg="surface" borderRadius="22px" overflow="hidden" mb="6">
        <Row icon={<LuLifeBuoy size={20} />} label={t("profile.support")} onClick={() => openExternal(SUPPORT_URL)} />
      </Box>

      <LanguageSheet open={sheet === "lang"} onClose={() => setSheet(null)} />
      <CountrySheet open={sheet === "country"} onClose={() => setSheet(null)} />
    </>
  );
}

function RowIcon({ children }: { children: ReactNode }) {
  return (
    <Box boxSize="36px" borderRadius="12px" bg="surfaceMuted" color="ink" display="grid" placeItems="center" flexShrink={0} aria-hidden>
      {children}
    </Box>
  );
}

export function Row({ icon, label, value, onClick }: { icon: ReactNode; label: string; value?: string; onClick: () => void }) {
  return (
    <chakra.button
      position="relative"
      type="button"
      onClick={onClick}
      w="full"
      display="flex"
      alignItems="center"
      gap="3"
      px="4"
      minH="60px"
      textAlign="start"
      cursor="pointer"
      _after={{
        content: '""',
        position: "absolute",
        bottom: 0,
        right: 0,
        bg: "line",
        width: "calc(100% - 65px)",
        height: "1px"
      }}
      _last={{
        _after: { display: "none" },
      }}
      _active={{ bg: "surfaceMuted" }}
    >
      <RowIcon>{icon}</RowIcon>
      <Text flex="1" fontWeight="500">
        {label}
      </Text>
      {value && (
        <Text color="inkMuted" fontSize="15px" truncate maxW="45%">
          {value}
        </Text>
      )}
      <Box color="inkMuted">
        <LuChevronRight size={18} aria-hidden />
      </Box>
    </chakra.button>
  );
}
