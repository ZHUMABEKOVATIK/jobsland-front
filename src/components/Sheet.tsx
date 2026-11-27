import { Box, Flex, Heading, Text, chakra } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { LuCheck } from "react-icons/lu";

/** Bottom sheet with backdrop, Escape to close and focus moved inside. */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>('[aria-checked="true"]') ??
        panelRef.current?.querySelector<HTMLElement>("button");
      target?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <Box position="fixed" inset="0" zIndex={50}>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, background: "rgba(12, 10, 20, 0.5)" }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, margin: "0 auto", maxWidth: 640 }}
          >
            <Box
              bg="surface"
              borderTopRadius="28px"
              px="4"
              pt="3"
              pb="calc(20px + env(safe-area-inset-bottom))"
              maxH="80dvh"
              overflowY="auto"
            >
              <Box w="40px" h="5px" borderRadius="full" bg="line" mx="auto" mb="4" />
              <Heading id={titleId} as="h2" fontSize="md" fontWeight="700" mb="3" px="2">
                {title}
              </Heading>
              {children}
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Radio list used inside sheets (language, country). */
export function OptionList<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ value: T; label: string; hint?: string; badge?: string }>;
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <Flex direction="column" role="radiogroup" aria-label={label} gap="1">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <chakra.button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            display="flex"
            alignItems="center"
            gap="3"
            minH="52px"
            px="3"
            borderRadius="16px"
            textAlign="start"
            cursor="pointer"
            bg={selected ? "surfaceMuted" : "transparent"}
            _hover={{ bg: "surfaceMuted" }}
          >
            {o.badge && (
              <Box
                as="span"
                minW="36px"
                h="28px"
                borderRadius="8px"
                bg="canvas"
                color="inkMuted"
                fontSize="xs"
                fontWeight="700"
                display="grid"
                placeItems="center"
              >
                {o.badge}
              </Box>
            )}
            <Box flex="1">
              <Text fontWeight={selected ? 600 : 500}>{o.label}</Text>
              {o.hint && (
                <Text fontSize="sm" color="inkMuted">
                  {o.hint}
                </Text>
              )}
            </Box>
            {selected && <LuCheck size={20} color="var(--chakra-colors-signal)" aria-hidden />}
          </chakra.button>
        );
      })}
    </Flex>
  );
}
