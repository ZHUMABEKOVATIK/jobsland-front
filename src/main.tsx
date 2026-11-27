import "@fontsource-variable/onest";
import "@fontsource-variable/unbounded";
import "./global.css";
import { ChakraProvider } from "@chakra-ui/react";
import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { initI18n } from "./i18n";
import { SettingsProvider, loadSettings } from "./lib/settings";
import { initTelegram } from "./lib/telegram";
import { system } from "./theme/system";

initTelegram();
const settings = loadSettings();
initI18n(settings.language);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <MotionConfig reducedMotion="user">
        <SettingsProvider initial={settings}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SettingsProvider>
      </MotionConfig>
    </ChakraProvider>
  </StrictMode>,
);
