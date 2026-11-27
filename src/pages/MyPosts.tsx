import { Box, Flex, Heading, Input, InputGroup, Stack, Text, chakra } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuInbox, LuSearch, LuSearchX, LuWifiOff, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination, PostCard, SegmentedControl } from "../components/posts";
import { CenteredSpinner, EmptyState, PillButton } from "../components/ui";
import { listPosts, type Post, type PostStatus } from "../lib/api";

type Filter = "all" | PostStatus;
const FILTERS: Filter[] = ["all", "in_review", "approved", "rejected"];
const PAGE_SIZE = 6;

export function MyPosts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Filter, query and page live in the URL so Back from a post restores the list
  const [params, setParams] = useSearchParams();
  const filter = (FILTERS.includes(params.get("status") as Filter) ? params.get("status") : "all") as Filter;
  const query = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [posts, setPosts] = useState<Post[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setFailed(false);
    setPosts(null);
    listPosts().then(setPosts, () => setFailed(true));
  };
  useEffect(() => {
    listPosts().then(setPosts, () => setFailed(true));
  }, []);

  const update = (next: Partial<{ status: Filter; q: string; page: number }>) => {
    const p = new URLSearchParams(params);
    const set = (k: string, v: string | undefined) => (v ? p.set(k, v) : p.delete(k));
    if ("status" in next) set("status", next.status === "all" ? undefined : next.status);
    if ("q" in next) set("q", next.q || undefined);
    set("page", next.page && next.page > 1 ? String(next.page) : undefined);
    setParams(p, { replace: true });
  };

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: 0, in_review: 0, approved: 0, rejected: 0 };
    posts?.forEach((p) => {
      c.all++;
      c[p.status]++;
    });
    return c;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (!q || [p.fields.title, p.fields.company, p.fields.organization, p.fields.city].some((s) => s?.toLowerCase().includes(q))),
    );
  }, [posts, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <Flex align="baseline" gap="2" mb="5" pt="var(--tg-safe-area-inset-top)" alignItems="center">
        <Heading as="h1" fontSize="26px" fontWeight="700" letterSpacing="-0.02em">
          {t("posts.title")}
        </Heading>
        {posts && posts.length > 0 && (
          <Text fontFamily="heading" fontWeight="600" color="inkMuted" fontSize="18px" bg="">
            <Box py="1" px="2" bg="surface" borderRadius="xl" boxShadow="0 0 5px #0000000c">
              {posts.length}
            </Box>
          </Text>
        )}
      </Flex>

      <InputGroup
        mb="3"
        startElement={<LuSearch size={18} aria-hidden />}
        endElement={
          query ? (
            <chakra.button
              type="button"
              aria-label={t("posts.clearSearch")}
              onClick={() => update({ q: "" })}
              boxSize="36px"
              display="grid"
              placeItems="center"
              borderRadius="full"
              cursor="pointer"
              color="inkMuted"
              me="-2"
            >
              <LuX size={18} aria-hidden />
            </chakra.button>
          ) : undefined
        }
      >
        <Input
          type="search"
          enterKeyHint="search"
          aria-label={t("posts.searchPlaceholder")}
          placeholder={t("posts.searchPlaceholder")}
          value={query}
          onChange={(e) => update({ q: e.target.value })}
          h="50px"
          bg="surface"
          border="none"
          borderRadius="full"
          fontSize="16px"
          _placeholder={{ color: "inkMuted" }}
        />
      </InputGroup>
      <SegmentedControl<Filter>
        label={t("posts.title")}
        value={filter}
        onChange={(v) => update({ status: v })}
        items={FILTERS.map((f) => ({ value: f, label: t(`posts.filters.${f}`), count: posts ? counts[f] : undefined }))}
      />

      <Box mt="4" aria-live="polite">
        {failed ? (
          <EmptyState
            icon={<LuWifiOff size={28} />}
            title={t("posts.loadError")}
            body=""
            action={<PillButton tone="soft" onClick={load}>{t("common.retry")}</PillButton>}
          />
        ) : !posts ? (
          <CenteredSpinner />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<LuInbox size={28} />}
            title={t("posts.emptyTitle")}
            body={t("posts.emptyBody")}
            action={<PillButton tone="signal" onClick={() => navigate("/home")}>{t("posts.emptyAction")}</PillButton>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<LuSearchX size={28} />}
            title={t("posts.noResultsTitle")}
            body={t("posts.noResultsBody")}
            action={
              query ? (
                <PillButton tone="soft" onClick={() => update({ q: "" })}>
                  {t("posts.clearSearch")}
                </PillButton>
              ) : undefined
            }
          />
        ) : (
          <>
            <Stack as="ul" gap="2.5" listStyleType="none" p="0" m="0">
              {visible.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </Stack>
            <Pagination
              page={current}
              total={totalPages}
              onChange={(p) => {
                update({ page: p });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </Box>
    </>
  );
}
