import { getTelegramUser } from "./telegram";

export const SUPPORT_URL = "https://t.me/" + import.meta.env.VITE_SUPPORT_URL || "zhumabekovatik"; // TODO: replace with the real support account

export function useCurrentUser() {
  const u = getTelegramUser();
  return {
    firstName: u?.first_name ?? "",
    fullName: [u?.first_name, u?.last_name].filter(Boolean).join(" "),
    username: u?.username,
    avatar: u?.photo_url || "/images/avatar.jpg",
  };
}
