import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuExternalLink, LuFileX, LuPencil, LuTrash2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { STATUS_STYLE } from "../components/posts";
import { Sheet } from "../components/Sheet";
import { CenteredSpinner, EmptyState, PageHeader, PillButton } from "../components/ui";
import { categoryById } from "../data/categories";
import { countryName, formatDate, formatNumber } from "../i18n/languages";
import { deletePost, getPost, type Post } from "../lib/api";
import { useSettings } from "../lib/settings";
import { haptic, openExternal } from "../lib/telegram";

const MONEY = new Set(["salaryFrom", "salaryTo", "stipend", "budget"]);

export function PostDetail() {
  const { post_id = "" } = useParams();
  const { t } = useTranslation();
  const { language } = useSettings();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPost(post_id).then((p) => setPost(p ?? null));
  }, [post_id]);

  if (post === undefined)
    return (
      <>
        <PageHeader title={t("posts.title")} fallback="/my-posts" />
        <CenteredSpinner />
      </>
    );

  if (post === null)
    return (
      <>
        <PageHeader title={t("posts.title")} fallback="/my-posts" />
        <EmptyState
          icon={<LuFileX size={28} />}
          title={t("detail.notFoundTitle")}
          body={t("detail.notFoundBody")}
          action={<PillButton tone="soft" onClick={() => navigate("/my-posts")}>{t("detail.backToPosts")}</PillButton>}
        />
      </>
    );

  const cat = categoryById(post.category)!;
  const Icon = cat.icon;
  const s = STATUS_STYLE[post.status];
  const currency = post.fields.currency ?? "";

  const display = (name: string, value: string) => {
    if (MONEY.has(name)) return `${formatNumber(value, language)} ${currency}`.trim();
    if (["employment", "workFormat", "paid", "location", "oppType"].includes(name)) return t(`options.${value}`);
    if (name === "deadline") return formatDate(value, language);
    return value;
  };
  const rows = cat.fields.filter(
    (f) => f.name !== "title" && f.name !== "currency" && post.fields[f.name]?.trim(),
  );

  async function onDelete() {
    setDeleting(true);
    await deletePost(post!.id);
    haptic.success();
    navigate("/my-posts", { replace: true });
  }

  return (
    <>
      <PageHeader title={t(`categories.${post.category}.title`)} fallback="/my-posts" />

      <Flex align="flex-start" gap="3" mb="4">
        <Box boxSize="52px" flexShrink={0} borderRadius="16px" bg={cat.color} color={cat.onColor} display="grid" placeItems="center" aria-hidden>
          <Icon size={24} strokeWidth={2.1} />
        </Box>
        <Box minW="0">
          <Heading as="h2" fontSize="20px" fontWeight="700" lineHeight="1.25" letterSpacing="-0.01em" textWrap="balance">
            {post.fields.title}
          </Heading>
          <Text fontSize="13px" color="inkMuted" mt="1">
            {t("detail.sentOn", { date: formatDate(post.createdAt, language, true) })}
          </Text>
        </Box>
      </Flex>

      <Box bg={s.bg} borderRadius="20px" p="4" mb="5">
        <Flex align="center" gap="2" color={s.fg} fontWeight="700">
          <s.icon size={20} aria-hidden />
          {t(`status.${post.status}`)}
        </Flex>
        <Text mt="1.5" fontSize="15px" lineHeight="1.5" color="ink">
          {t(`detail.info.${post.status}`)}
        </Text>
        {post.status === "rejected" && post.rejectionReason && (
          <Box mt="3" pt="3" position="relative">
            <Box position="absolute" top="0" left="0" right="0" h="1px" bg={s.fg} opacity={0.2} />
            <Text fontSize="13px" fontWeight="600" color={s.fg}>
              {t("detail.reason")}
            </Text>
            <Text fontSize="15px" lineHeight="1.5" mt="0.5">
              {post.rejectionReason}
            </Text>
          </Box>
        )}
      </Box>

      <Heading as="h3" fontSize="15px" fontFamily="body" fontWeight="600" mb="2" px="1">
        {t("detail.details")}
      </Heading>
      <Box as="dl" bg="surface" borderRadius="20px" px="4" mb="6">
        <DetailRow label={t("detail.country")} value={countryName(post.country, language)} />
        {rows.map((f) => (
          <DetailRow key={f.name} label={t(f.labelKey ?? `fields.${f.name}`)} value={display(f.name, post.fields[f.name])} />
        ))}
      </Box>

      <Stack gap="3">
        {post.status === "approved" && post.channelUrl && (
          <PillButton tone="signal" full minH="54px" onClick={() => openExternal(post.channelUrl!)}>
            <LuExternalLink size={18} aria-hidden />
            {t("detail.openInChannel")}
          </PillButton>
        )}
        {post.status === "rejected" && (
          <PillButton
            tone="signal"
            full
            minH="54px"
            onClick={() => navigate(`/home/${cat.path}`, { state: { resendId: post.id, fields: post.fields } })}
          >
            <LuPencil size={18} aria-hidden />
            {t("detail.editResend")}
          </PillButton>
        )}
        <PillButton tone="danger" full minH="54px" onClick={() => (haptic.warning(), setConfirm(true))}>
          <LuTrash2 size={18} aria-hidden />
          {t("detail.delete")}
        </PillButton>
      </Stack>

      <Sheet open={confirm} onClose={() => setConfirm(false)} title={t("detail.confirmTitle")}>
        <Text color="inkMuted" px="2" mb="5" lineHeight="1.5">
          {t("detail.confirmBody")}
        </Text>
        <Stack gap="2">
          <PillButton tone="danger" full minH="52px" onClick={onDelete} disabled={deleting}>
            {t("detail.confirmDelete")}
          </PillButton>
          <PillButton tone="soft" full minH="52px" onClick={() => setConfirm(false)}>
            {t("common.cancel")}
          </PillButton>
        </Stack>
      </Sheet>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box py="3" borderBottom="1px solid" borderColor="line" _last={{ borderBottom: "none" }}>
      <Text as="dt" fontSize="13px" color="inkMuted">
        {label}
      </Text>
      <Text as="dd" fontSize="15px" lineHeight="1.5" whiteSpace="pre-line" css={{ overflowWrap: "anywhere" }}>
        {value}
      </Text>
    </Box>
  );
}
