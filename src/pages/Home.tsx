import { Box, Flex, Heading, SimpleGrid, Text, chakra } from "@chakra-ui/react";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuShieldCheck } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CountrySheet } from "../components/Pickers";
import { CATEGORIES, type CategoryDef } from "../data/categories";
import { countryName } from "../i18n/languages";
import { useSettings } from "../lib/settings";
import { haptic } from "../lib/telegram";
import { useCurrentUser } from "../lib/user";

const STUB = 66; // height of the tear-off stub under the perforation, px

const grid: Variants = { show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } };
const tile: Variants = {
  hidden: { opacity: 0, y: 18, rotate: -1.5, scale: 0.96 },
  show: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function Home() {
  const { t } = useTranslation();
  const { country, language } = useSettings();
  const user = useCurrentUser();
  const [countryOpen, setCountryOpen] = useState(false);

  return (
    <>
      <Flex align="center" gap="2" mb="6" justify="center" h="var(--tg-content-safe-area-inset-top)">
        <Logo />
        <Text fontFamily="heading" fontWeight="700" fontSize="15px" letterSpacing="-0.01em">
          Jobsland
        </Text>
      </Flex>

      <Heading
        as="h1"
        fontSize={{ base: "26px", sm: "32px" }}
        lineHeight="1.15"
        fontWeight="700"
        letterSpacing="-0.02em"
        textWrap="balance"
        mb="3"
      >
        {user.firstName ? t("home.greeting", { name: user.firstName }) : t("home.greetingNoName")}
      </Heading>
      <Text color="inkMuted" fontSize="15px" lineHeight="1.55" maxW="44ch" textWrap="pretty" mb="7">
        {t("home.intro")}
      </Text>

      <Heading as="h2" fontSize="15px" fontWeight="600" fontFamily="body" mb="3">
        {t("home.chooseType")}
      </Heading>

      <motion.div variants={grid} initial="hidden" animate="show">
        <SimpleGrid as="ul" columns={2} gap="3" listStyleType="none" p="0" m="0">
          {CATEGORIES.map((c) => (
            <motion.li key={c.id} variants={tile}>
              <TicketTile category={c} />
            </motion.li>
          ))}
        </SimpleGrid>
      </motion.div>

      <Box
        // type="button"
        // onClick={() => setCountryOpen(true)}
        mt="5"
        w="full"
        display="flex"
        alignItems="center"
        gap="3"
        p="3"
        pr="4"
        minH="64px"
        bg="surface"
        borderRadius="20px"
        textAlign="start"
        cursor="pointer"
        transition="transform 0.12s"
        // _active={{ transform: "scale(0.985)" }}
      >
        <Box
          boxSize="40px"
          borderRadius="full"
          bg="surfaceMuted"
          display="grid"
          placeItems="center"
          fontWeight="700"
          fontSize="sm"
          flexShrink={0}
        >
          {country}
        </Box>
        <Box flex="1" minW="0">
          <Text fontSize="13px" color="inkMuted">
            {t("home.countryLabel")}
          </Text>
          <Text fontWeight="600" truncate>
            {countryName(country, language)}
          </Text>
        </Box>
        {/* <Text color="signal" fontWeight="600" fontSize="sm">
          {t("home.change")}
        </Text> */}
      </Box>

      <Flex mt="3" gap="3" p="4" borderRadius="20px" bg="approvedSoft" color="ink" align="flex-start">
        <Box color="approved" mt="0.5" flexShrink={0}>
          <LuShieldCheck size={22} aria-hidden />
        </Box>
        <Box>
          <Text fontWeight="700">{t("home.freeTitle")}</Text>
          <Text fontSize="14px" lineHeight="1.5" color="inkMuted" mt="0.5">
            {t("home.scamText")}
          </Text>
        </Box>
      </Flex>

      <CountrySheet open={countryOpen} onClose={() => setCountryOpen(false)} />
    </>
  );
}

/** A classified-ad "ticket": notched sides, perforation, oversized cropped icon. */
function TicketTile({ category: c }: { category: CategoryDef }) {
  const { t } = useTranslation();
  const Icon = c.icon;
  const onDark = c.onColor === "white";
  const notch = `calc(100% - ${STUB}px)`;
  const mask = `radial-gradient(circle 9px at 0 ${notch}, transparent 96%, #000) left / 51% 100% no-repeat, radial-gradient(circle 9px at 100% ${notch}, transparent 96%, #000) right / 51% 100% no-repeat`;

  return (
    <Link to={`/home/${c.path}`} onClick={() => haptic.tap()} style={{ display: "block", borderRadius: 26 }}>
      <motion.div whileTap={{ scale: 0.965 }} transition={{ type: "spring", stiffness: 600, damping: 30 }}>
        <Box
          position="relative"
          h={{ base: "200px", sm: "220px" }}
          bg={c.color}
          color={c.onColor}
          borderRadius="26px"
          overflow="hidden"
          css={{ mask, WebkitMask: mask }}
        >
          <Box
            position="absolute"
            top="-22px"
            right="-26px"
            opacity={onDark ? 0.22 : 0.18}
            transform="rotate(-14deg)"
            aria-hidden
          >
            <Icon size={132} strokeWidth={1.6} />
          </Box>
          <Box
            position="absolute"
            top="14px"
            left="14px"
            boxSize="38px"
            borderRadius="12px"
            display="grid"
            placeItems="center"
            bg={onDark ? "rgba(255,255,255,0.18)" : "rgba(27,21,48,0.10)"}
            aria-hidden
          >
            <Icon size={20} strokeWidth={2.2} />
          </Box>

          <Flex position="absolute" left="0" right="0" top="0" bottom={`${STUB}px`} px="14px" pb="10px" align="flex-end">
            <Text
              fontFamily="heading"
              fontWeight="700"
              fontSize={{ base: "15px", sm: "17px" }}
              lineHeight="1.2"
              letterSpacing="-0.01em"
              css={{ hyphens: "auto", overflowWrap: "anywhere" }}
              lineClamp={3}
            >
              {t(`categories.${c.id}.title`)}
            </Text>
          </Flex>

          <Box
            position="absolute"
            left="12px"
            right="12px"
            bottom={`${STUB}px`}
            borderTop="2px dashed"
            borderColor={onDark ? "rgba(255,255,255,0.38)" : "rgba(27,21,48,0.22)"}
            aria-hidden
          />

          <Flex position="absolute" left="0" right="0" bottom="0" h={`${STUB}px`} px="14px" align="center">
            <Text fontSize="13px" lineHeight="1.35" fontWeight="500" opacity={onDark ? 0.92 : 0.8} lineClamp={2}>
              {t(`categories.${c.id}.desc`)}
            </Text>
          </Flex>
        </Box>
      </motion.div>
    </Link>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="18" fill="#2D5BEF" />
      <path d="M38 16v22a10 10 0 0 1-20 0" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="46" cy="18" r="5" fill="#FFB547" />
    </svg>
  );
}
