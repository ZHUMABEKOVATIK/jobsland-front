import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

/**
 * Jobsland design tokens.
 * Colours are semantic so every component works in light and dark (Telegram) themes.
 */
const config = defineConfig({
  globalCss: {
    "html, body": {
      bg: "canvas",
      color: "ink",
      fontFamily: "body",
      WebkitTapHighlightColor: "transparent",
      overscrollBehaviorY: "none",
    },
    body: { minHeight: "100dvh" },
    "::selection": { bg: "signal", color: "white" },
    "*:focus-visible": {
      outline: "2px solid {colors.signal}",
      outlineOffset: "2px",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'Unbounded Variable', 'Onest Variable', system-ui, sans-serif" },
        body: { value: "'Google Sans', 'Onest Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" },
      },
      colors: {
        cobalt: { value: "#2D5BEF" },
        apricot: { value: "#FFB547" },
        mint: { value: "#3DDC97" },
        violet: { value: "#7B4DFF" },
        plum: { value: "#1B1530" },
      },
    },
    semanticTokens: {
      colors: {
        canvas: { value: { base: "#EEF0F7", _dark: "#14121C" } },
        surface: { value: { base: "#FFFFFF", _dark: "#211E2C" } },
        surfaceMuted: { value: { base: "#E3E6F0", _dark: "#2B2738" } },
        ink: { value: { base: "#1B1530", _dark: "#F3F1FA" } },
        inkMuted: { value: { base: "#5E5A72", _dark: "#ABA6BF" } },
        line: { value: { base: "#D9DCE8", _dark: "#373244" } },
        signal: { value: { base: "#1F6AF5", _dark: "#5B9BFF" } },
        onSignal: { value: { base: "#FFFFFF", _dark: "#0B1533" } },
        review: { value: { base: "#B26B00", _dark: "#FFC163" } },
        reviewSoft: { value: { base: "#FFF1D6", _dark: "#3A2E17" } },
        approved: { value: { base: "#0B7A4B", _dark: "#5BE3A5" } },
        approvedSoft: { value: { base: "#D8F6E8", _dark: "#173327" } },
        rejected: { value: { base: "#C8243B", _dark: "#FF7D8E" } },
        rejectedSoft: { value: { base: "#FFE1E5", _dark: "#3D1C23" } },
        postCountBg: { value: { base: "#00000023", _dark: "#aeaeae23" } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
