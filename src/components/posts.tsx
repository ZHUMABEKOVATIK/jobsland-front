import { Box, Flex, Text, chakra } from "@chakra-ui/react";
import { motion } from "motion/react";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { LuChevronLeft, LuChevronRight, LuCircleCheck, LuCircleX, LuClock } from "react-icons/lu";
import { Link } from "react-router-dom";
import { categoryById } from "../data/categories";
import { formatDate } from "../i18n/languages";
import type { Post, PostStatus } from "../lib/api";
import { useSettings } from "../lib/settings";

export const STATUS_STYLE: Record<PostStatus, { fg: string; bg: string; icon: typeof LuClock }> = {
  in_review: { fg: "review", bg: "reviewSoft", icon: LuClock },
  approved: { fg: "approved", bg: "approvedSoft", icon: LuCircleCheck },
  rejected: { fg: "rejected", bg: "rejectedSoft", icon: LuCircleX },
};

export function StatusBadge({ status }: { status: PostStatus }) {
  const { t } = useTranslation();
  const s = STATUS_STYLE[status];
  return (
    <Flex
      as="span"
      align="center"
      gap="1"
      h="26px"
      px="2.5"
      borderRadius="full"
      bg={s.bg}
      color={s.fg}
      fontSize="12px"
      fontWeight="600"
      whiteSpace="nowrap"
      flexShrink={0}
    >
      <s.icon size={14} aria-hidden />
      {t(`status.${status}`)}
    </Flex>
  );
}

/** Subtitle for a post card: company / organisation / budget, whichever applies */
function subtitle(p: Post) {
  return p.fields.company || p.fields.organization || p.fields.city || "";
}

export function PostCard({ post }: { post: Post }) {
  const { t } = useTranslation();
  const { language } = useSettings();
  const cat = categoryById(post.category)!;
  const Icon = cat.icon;
  const sub = subtitle(post);

  return (
    <Link to={`/my-posts/${post.id}`} style={{ display: "block", borderRadius: 22 }}>
      <Flex
        gap="3"
        p="3.5"
        bg="surface"
        borderRadius="22px"
        transition="transform 0.12s"
        _active={{ transform: "scale(0.985)" }}
        align="flex-start"
      >
        <Box
          boxSize="44px"
          flexShrink={0}
          borderRadius="14px"
          bg={cat.color}
          color={cat.onColor}
          display="grid"
          placeItems="center"
          aria-hidden
        >
          <Icon size={20} strokeWidth={2.1} />
        </Box>
        <Box flex="1" minW="0">
          <Text fontWeight="600" lineHeight="1.3" lineClamp={2}>
            {post.fields.title || "—"}
          </Text>
          <Text fontSize="13px" color="inkMuted" mt="0.5" truncate>
            {sub ? `${t(`categories.${post.category}.title`)}, ${sub}` : t(`categories.${post.category}.title`)}
          </Text>
          <Flex mt="2.5" align="center" justify="space-between" gap="2">
            <StatusBadge status={post.status} />
            <Text fontSize="12px" color="inkMuted" whiteSpace="nowrap">
              {formatDate(post.createdAt, language)}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Link>
  );
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: Array<{ value: T; label: string; count?: number }>;
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  const layoutId = useId();
  return (
    <Box 
      overflowX="hidden"
    >
      <Flex 
        role="tablist" 
        aria-label={label} 
        bg="surfaceMuted" 
        p="1" 
        borderRadius="full"
        minW="full"
        maxW="100%"
        overflowX="auto"
        css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      >
        {items.map((it) => {
          const active = it.value === value;
          return (
            <chakra.button
              key={it.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(it.value)}
              position="relative"
              flex="1"
              minH="40px"
              px="3.5"
              borderRadius="full"
              fontSize="14px"
              fontWeight={active ? 600 : 500}
              color={active ? "ink" : "inkMuted"}
              whiteSpace="nowrap"
              cursor="pointer"
              transition="color 0.2s"
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  style={{ position: "absolute", inset: 0, borderRadius: 999 }}
                >
                  <Box w="full" h="full" borderRadius="full" bg="surface" boxShadow="0 1px 3px rgba(20,16,40,0.12)" />
                </motion.span>
              )}
              <chakra.span position="relative" display="inline-flex" alignItems="center" gap="1.5">
                {it.label}
                {it.count !== undefined && (
                  <chakra.span fontSize="12px" fontWeight="600" color={active ? "signal" : "inkMuted"} opacity={active ? 1 : 0.8}>
                    {it.count}
                  </chakra.span>
                )}
              </chakra.span>
            </chakra.button>
          );
        })}
      </Flex>
    </Box>
  );
}

export function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const { t } = useTranslation();
  if (total <= 1) return null;
  const pages = pageWindow(page, total);
  const btn = {
    minW: "44px",
    h: "44px",
    borderRadius: "full",
    display: "grid",
    placeItems: "center",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    _disabled: { opacity: 0.35, cursor: "default" },
  } as const;
  return (
    <Flex as="nav" aria-label={t("posts.page", { page, total })} justify="center" align="center" gap="1" mt="6">
      <chakra.button type="button" {...btn} bg="surface" aria-label={t("posts.prev")} disabled={page === 1} onClick={() => onChange(page - 1)}>
        <LuChevronLeft size={20} aria-hidden />
      </chakra.button>
      {pages.map((p, i) =>
        p === "…" ? (
          <Text key={`gap${i}`} color="inkMuted" w="28px" textAlign="center" aria-hidden>
            …
          </Text>
        ) : (
          <chakra.button
            key={p}
            type="button"
            {...btn}
            bg={p === page ? "ink" : "transparent"}
            color={p === page ? "canvas" : "ink"}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </chakra.button>
        ),
      )}
      <chakra.button type="button" {...btn} bg="surface" aria-label={t("posts.next")} disabled={page === total} onClick={() => onChange(page + 1)}>
        <LuChevronRight size={20} aria-hidden />
      </chakra.button>
    </Flex>
  );
}

function pageWindow(page: number, total: number): Array<number | "…"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 4, "…", total];
  if (page >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", page, "…", total];
}
