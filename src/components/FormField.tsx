import { Field, Flex, Input, NativeSelect, Textarea, chakra } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { FieldDef } from "../data/categories";

const control = {
  bg: "surface",
  borderWidth: "1.5px",
  borderColor: "line",
  borderRadius: "14px",
  fontSize: "16px", // ≥16px prevents iOS zoom on focus
  color: "ink",
  _placeholder: { color: "inkMuted", opacity: 0.7 },
} as const;

export function FormField({
  def,
  value,
  error,
  onChange,
  onBlur,
}: {
  def: FieldDef;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const { t } = useTranslation();
  const label = t(def.labelKey ?? `fields.${def.name}`);
  const id = `f-${def.name}`;

  return (
    <Field.Root invalid={Boolean(error)} required={def.required} flex="1" minW="0" gap="1.5">
      <Field.Label htmlFor={id} fontSize="14px" fontWeight="600" color="ink">
        {label}
        {def.required ? (
          <Field.RequiredIndicator color="rejected" />
        ) : (
          <chakra.span color="inkMuted" fontWeight="400" ms="1">
            ({t("common.optional")})
          </chakra.span>
        )}
      </Field.Label>

      {def.kind === "textarea" && (
        <Textarea
          id={id}
          name={def.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          rows={4}
          autoresize
          minH="112px"
          py="3"
          placeholder={def.placeholder}
          {...control}
        />
      )}

      {(def.kind === "text" || def.kind === "url" || def.kind === "number" || def.kind === "date") && (
        <Input
          id={id}
          name={def.name}
          type={def.kind === "url" ? "url" : def.kind === "date" ? "date" : "text"}
          inputMode={def.kind === "number" ? "numeric" : def.kind === "url" ? "url" : undefined}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(def.kind === "number" ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
          onBlur={onBlur}
          h="52px"
          {...control}
        />
      )}

      {def.kind === "select" && (
        <NativeSelect.Root>
          <NativeSelect.Field
            id={id}
            name={def.name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            h="52px"
            {...control}
          >
            {!def.rawOptions && <option value="">{t("form.selectPlaceholder")}</option>}
            {def.options?.map((o) => (
              <option key={o} value={o}>
                {def.rawOptions ? o : t(`options.${o}`)}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator color="inkMuted" />
        </NativeSelect.Root>
      )}

      {def.kind === "choice" && (
        <Flex id={id} role="radiogroup" aria-label={label} gap="2" wrap="wrap">
          {def.options?.map((o) => {
            const selected = value === o;
            return (
              <chakra.button
                key={o}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  onChange(o);
                  onBlur();
                }}
                minH="44px"
                px="4"
                borderRadius="full"
                borderWidth="1.5px"
                borderColor={selected ? "ink" : error ? "rejected" : "line"}
                bg={selected ? "ink" : "surface"}
                color={selected ? "canvas" : "ink"}
                fontWeight="500"
                fontSize="15px"
                cursor="pointer"
                transition="background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s"
                _active={{ transform: "scale(0.96)" }}
              >
                {t(`options.${o}`)}
              </chakra.button>
            );
          })}
        </Flex>
      )}

      {error ? (
        <Field.ErrorText fontSize="13px" color="rejected">
          {error}
        </Field.ErrorText>
      ) : (
        def.hintKey && (
          <Field.HelperText fontSize="13px" color="inkMuted">
            {t(def.hintKey)}
          </Field.HelperText>
        )
      )}
    </Field.Root>
  );
}
