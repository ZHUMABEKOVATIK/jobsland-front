import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { LuCircleAlert } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { FormField } from "../components/FormField";
import { PageHeader, PillButton } from "../components/ui";
import type { CategoryDef, FieldDef } from "../data/categories";
import { DEFAULT_CURRENCY } from "../data/countries";
import { countryName } from "../i18n/languages";
import { createPost, resubmitPost } from "../lib/api";
import { useSettings } from "../lib/settings";
import { haptic } from "../lib/telegram";

type Values = Record<string, string>;
interface ResendState {
  resendId: string;
  fields: Values;
}

const draftKey = (id: string) => `jobsland:draft:${id}`;

export function CreatePost({ category }: { category: CategoryDef }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { country, language } = useSettings();
  const resend = (location.state as ResendState | null) ?? null;

  const initial = useMemo<Values>(() => {
    if (resend) return resend.fields;
    try {
      const draft = localStorage.getItem(draftKey(category.id));
      if (draft) return JSON.parse(draft);
    } catch {
      /* ignore */
    }
    return { currency: DEFAULT_CURRENCY[country] };
  }, [category.id, country, resend]);

  const [values, setValues] = useState<Values>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [done, setDone] = useState(false);

  // Keep an unsent draft on this device (not for resends)
  useEffect(() => {
    if (resend || done) return;
    try {
      localStorage.setItem(draftKey(category.id), JSON.stringify(values));
    } catch {
      /* ignore */
    }
  }, [values, category.id, resend, done]);

  const errors = useMemo(() => validate(category.fields, values, t), [category.fields, values, t]);
  const visibleError = (name: string) => (submitted || touched[name] ? errors[name] : undefined);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSendError(false);
    const firstInvalid = category.fields.find((f) => errors[f.name]);
    if (firstInvalid) {
      haptic.error();
      const el = document.getElementById(`f-${firstInvalid.name}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el?.matches("input,textarea,select") ? el : el?.querySelector("button"))?.focus({ preventScroll: true });
      return;
    }
    setSending(true);
    try {
      const clean = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.trim()]));
      if (resend) await resubmitPost(resend.resendId, clean);
      else await createPost({ category: category.id, country, fields: clean });
      try {
        localStorage.removeItem(draftKey(category.id));
      } catch {
        /* ignore */
      }
      haptic.success();
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch {
      haptic.error();
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  const rows = groupHalves(category.fields);
  const Icon = category.icon;
  const title = t(`categories.${category.id}.title`);

  return (
    <>
      <PageHeader title={title} />
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <Success
            key="done"
            onPosts={() => navigate("/my-posts", { replace: true })}
            onAnother={() => navigate("/home", { replace: true })}
          />
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <Flex
              gap="3"
              align="center"
              p="3"
              pr="4"
              mb="6"
              borderRadius="20px"
              bg={category.color}
              color={category.onColor}
            >
              <Box
                boxSize="40px"
                borderRadius="12px"
                display="grid"
                placeItems="center"
                flexShrink={0}
                bg={category.onColor === "white" ? "rgba(255,255,255,0.18)" : "rgba(27,21,48,0.10)"}
              >
                <Icon size={20} aria-hidden />
              </Box>
              <Text fontSize="14px" lineHeight="1.45" fontWeight="500">
                {resend ? t("form.editing") : t("form.intro", { country: countryName(country, language) })}
              </Text>
            </Flex>

            <Stack gap="5">
              {rows.map((row) => (
                <Flex key={row.map((f) => f.name).join()} gap="3">
                  {row.map((def) => (
                    <FormField
                      key={def.name}
                      def={def}
                      value={values[def.name] ?? ""}
                      error={visibleError(def.name)}
                      onChange={(v) => setValues((s) => ({ ...s, [def.name]: v }))}
                      onBlur={() => setTouched((s) => ({ ...s, [def.name]: true }))}
                    />
                  ))}
                </Flex>
              ))}
            </Stack>

            <Box mt="8">
              {(sendError || (submitted && Object.keys(errors).length > 0)) && (
                <Flex role="alert" gap="2" align="center" color="rejected" fontSize="14px" mb="3" fontWeight="500">
                  <LuCircleAlert size={18} aria-hidden />
                  {sendError ? t("form.errorSend") : t("form.fixBelow")}
                </Flex>
              )}
              <PillButton type="submit" tone="signal" full disabled={sending} aria-busy={sending} minH="54px">
                {sending ? t("form.sending") : resend ? t("form.resubmit") : t("form.submit")}
              </PillButton>
            </Box>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}

function Success({ onPosts, onAnother }: { onPosts: () => void; onAnother: () => void }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <Flex direction="column" align="center" textAlign="center" pt="10" pb="6" gap="4" role="status">
        <Box boxSize="96px" borderRadius="full" bg="approvedSoft" color="approved" display="grid" placeItems="center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
            />
          </svg>
        </Box>
        <Heading as="h2" fontSize="22px" fontWeight="700" letterSpacing="-0.01em">
          {t("form.successTitle")}
        </Heading>
        <Text color="inkMuted" maxW="34ch" lineHeight="1.55" textWrap="pretty">
          {t("form.successBody")}
        </Text>
      </Flex>
      <Stack gap="3">
        <PillButton tone="signal" full onClick={onPosts} minH="54px">
          {t("form.openMyPosts")}
        </PillButton>
        <PillButton tone="soft" full onClick={onAnother} minH="54px">
          {t("form.postAnother")}
        </PillButton>
      </Stack>
    </motion.div>
  );
}

function groupHalves(fields: FieldDef[]): FieldDef[][] {
  const rows: FieldDef[][] = [];
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (f.half && fields[i + 1]?.half) {
      rows.push([f, fields[i + 1]]);
      i++;
    } else rows.push([f]);
  }
  return rows;
}

function validate(fields: FieldDef[], v: Values, t: (k: string) => string): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const val = (v[f.name] ?? "").trim();
    if (f.required && !val) errors[f.name] = t("form.errorRequired");
    else if (f.kind === "url" && val && !/^https:\/\/[^\s.]+\.[^\s]+$/i.test(val)) errors[f.name] = t("form.errorUrl");
  }
  const from = Number(v.salaryFrom);
  const to = Number(v.salaryTo);
  if (v.salaryFrom && v.salaryTo && to < from) errors.salaryTo = t("form.errorRange");
  return errors;
}
