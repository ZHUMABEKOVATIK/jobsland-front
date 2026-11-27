import { useEffect } from "react";

/** Minimal typing for the parts of Telegram.WebApp we use. */
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
  };
  colorScheme: "light" | "dark";
  ready(): void;
  expand(): void;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
  setBottomBarColor?(color: string): void;
  onEvent(event: string, cb: () => void): void;
  offEvent(event: string, cb: () => void): void;
  openTelegramLink?(url: string): void;
  openLink?(url: string): void;
  BackButton: {
    show(): void;
    hide(): void;
    onClick(cb: () => void): void;
    offClick(cb: () => void): void;
  };
  HapticFeedback?: {
    impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void;
    notificationOccurred(type: "error" | "success" | "warning"): void;
    selectionChanged(): void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export const tg: TelegramWebApp | undefined = window.Telegram?.WebApp;

/** True only when the page actually runs inside a Telegram client. */
export const isTelegram = Boolean(tg?.initData);

export function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
}

export function getTelegramUser() {
  return tg?.initDataUnsafe?.user;
}

export function paintTelegramChrome(color: string) {
  if (!isTelegram || !tg) return;
  try {
    tg.setHeaderColor?.(color);
    tg.setBackgroundColor?.(color);
    tg.setBottomBarColor?.(color);
  } catch {
    /* older clients */
  }
}

export const haptic = {
  tap: () => tg?.HapticFeedback?.impactOccurred("light"),
  select: () => tg?.HapticFeedback?.selectionChanged(),
  success: () => tg?.HapticFeedback?.notificationOccurred("success"),
  error: () => tg?.HapticFeedback?.notificationOccurred("error"),
  warning: () => tg?.HapticFeedback?.notificationOccurred("warning"),
};

export function openExternal(url: string) {
  if (isTelegram && tg) {
    if (url.startsWith("https://t.me/") && tg.openTelegramLink) return tg.openTelegramLink(url);
    if (tg.openLink) return tg.openLink(url);
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Shows Telegram's native back button while `visible` is true. */
export function useTelegramBackButton(visible: boolean, onBack: () => void) {
  useEffect(() => {
    if (!isTelegram || !tg) return;
    if (!visible) {
      tg.BackButton.hide();
      return;
    }
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
    return () => {
      tg.BackButton.offClick(onBack);
    };
  }, [visible, onBack]);
}
