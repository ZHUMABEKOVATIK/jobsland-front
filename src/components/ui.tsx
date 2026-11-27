import { Box, Flex, Heading, Spinner, Text, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { isTelegram } from "../lib/telegram";

/** Base for every custom button: 48px tall, pill, visible focus, pressed state. */
export const PillButton = chakra("button", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
    minH: "48px",
    px: "6",
    borderRadius: "full",
    fontWeight: "600",
    fontSize: "md",
    cursor: "pointer",
    transition: "transform 0.12s ease, background 0.2s, opacity 0.2s",
    _active: { transform: "scale(0.97)" },
    _disabled: { opacity: 0.55, cursor: "not-allowed", _active: { transform: "none" } },
  },
  variants: {
    tone: {
      primary: { bg: "ink", color: "canvas" },
      signal: { bg: "signal", color: "onSignal" },
      soft: { bg: "surfaceMuted", color: "ink" },
      danger: { bg: "rejectedSoft", color: "rejected" },
    },
    full: { true: { w: "full" } },
  },
  defaultVariants: { tone: "primary" },
});

export function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <chakra.button
      type="button"
      aria-label={label}
      onClick={onClick}
      boxSize="44px"
      flexShrink={0}
      display="grid"
      placeItems="center"
      borderRadius="full"
      bg="surface"
      color="ink"
      cursor="pointer"
      transition="transform 0.12s"
      _active={{ transform: "scale(0.94)" }}
    >
      {children}
    </chakra.button>
  );
}

/** Header for nested pages. Telegram supplies its own back button, so we only draw one in a browser. */
export function PageHeader({ title, fallback = "/home" }: { title: string; fallback?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Flex align="center" gap="3" mb="5" minH="44px" pt="var(--tg-safe-area-inset-top)">
      {!isTelegram && (
        <IconButton
          label={t("common.back")}
          onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate(fallback))}
        >
          <LuChevronLeft size={22} aria-hidden />
        </IconButton>
      )}
      <Heading as="h1" fontSize="lg" fontWeight="700" lineHeight="1.25" lineClamp={2}>
        {title}
      </Heading>
    </Flex>
  );
}

export function CenteredSpinner() {
  return (
    <Flex justify="center" py="16" role="status">
      <Spinner color="signal" size="lg" />
    </Flex>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <Flex direction="column" align="center" textAlign="center" py="12" px="6" gap="3">
      <Box boxSize="64px" borderRadius="22px" bg="surfaceMuted" color="inkMuted" display="grid" placeItems="center" mb="1">
        {icon}
      </Box>
      <Heading as="h2" fontSize="md" fontWeight="700">
        {title}
      </Heading>
      <Text color="inkMuted" maxW="32ch" textWrap="pretty">
        {body}
      </Text>
      {action && <Box mt="2">{action}</Box>}
    </Flex>
  );
}
