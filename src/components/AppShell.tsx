import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTelegramBackButton } from "../lib/telegram";
import { BottomNav } from "./BottomNav";

const TOP_LEVEL = ["/home", "/my-posts", "/profile"];

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navVisible = TOP_LEVEL.includes(pathname.replace(/\/$/, ""));

  const goBack = useCallback(() => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(pathname.startsWith("/my-posts") ? "/my-posts" : "/home");
  }, [navigate, pathname]);
  useTelegramBackButton(!navVisible, goBack);

  return (
    <Box minH="100dvh">
      <Box
        as="main"
        maxW="640px"
        mx="auto"
        px="4"
        pt="env(safe-area-inset-top)"
        pb={navVisible ? "calc(120px + env(safe-area-inset-bottom))" : "calc(32px + env(safe-area-inset-bottom))"}
      >
        <Outlet />
      </Box>
      <AnimatePresence initial={false}>
        {navVisible && (
          <motion.div
            key="nav"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            style={{ position: "relative", zIndex: 20 }}
          >
            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
