import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuHouse, LuLayers } from "react-icons/lu";
import { NavLink, useLocation } from "react-router-dom";
import { haptic } from "../lib/telegram";
import { useCurrentUser } from "../lib/user";

const ACTIVE = "#5B9BFF";

const items = [
  { id: "home", route: "/home", labelKey: "nav.home", icon: LuHouse },
  { id: "my-posts", route: "/my-posts", labelKey: "nav.myPosts", icon: LuLayers },
  { id: "profile", route: "/profile", labelKey: "nav.profile", icon: null },
] as const;

/** Floating "liquid glass" tab bar. Always dark, independent of app theme. */
export function BottomNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const user = useCurrentUser();

  const activeIndex = items.findIndex((item) =>
    pathname.startsWith(item.route)
  );
  const currentIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <Box
      position="fixed"
      display="flex"
      bottom="0"
      left="0"
      right="0"
      alignItems="center"
      justifyContent="center"
      w="vw"
      h="auto"
      zIndex={20}
      paddingBottom="var(--tg-safe-area-inset-bottom)"
    >
      <Box
        id="bottom-navbar"
        display="flex"
        flexDirection="row"
        borderRadius="full"
        p="6px 14px"
        bg="rgba(35, 35, 35, 0.2)"
        _dark={{
          bg: "#14121c2d"
        }}
        _light={{
          bg: "rgba(213, 213, 213, 0.1)"
        }}
        style={{
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
        }}
        boxShadow="0 10px 36px rgba(0,0,0,0.45)"
        _before={{
          content: '""',
          position: "absolute",
          inset: 0,
          padding: "1px",
          borderRadius: "inherit",
          pointerEvents: "none",
          background:
            "linear-gradient(155deg, rgba(255, 255, 255, 0.32) 0%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 58%, rgba(255, 255, 255, 0.3) 100%)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <Box
          position="absolute"
          top="5px"
          bottom="5px"
          left="5px"
          w="calc((100% - 10px) / 3 + 5%)"
          _dark={{
            bg: "color-mix(in oklab, #fff 12%, transparent)"
          }}
          _light={{
            bg: "color-mix(in oklab, #000 18%, transparent)"
          }}
          borderRadius="full"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.06)"
          transform={`translateX(${currentIndex * 100 - currentIndex * 20}%)`}
          transition="transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
          zIndex={0}
        />
        {items.map((item) => {
          const active = pathname === item.route || pathname.startsWith(item.route + "/");
          const label = t(item.labelKey);
          return (
            <Box key={item.id} flex="1" whiteSpace="nowrap" overflow="hidden">
              <NavLink
                to={item.route}
                aria-current={active ? "page" : undefined}
                onClick={() => !active && haptic.select()}
                style={{ display: "block", borderRadius: 100, position: "relative", padding: "6px 10px", height: "100%" }}
              >
                <Flex
                  position="relative"
                  direction="column"
                  align="center"
                  justify="center"
                  gap="4px"
                  h="full"
                  color="var(--primary-color)"
                  transition="color 0.2s"
                >
                  {item.icon ? (
                    <item.icon size={24} aria-hidden />
                  ) : (
                    <Image
                      src={user.avatar}
                      alt=""
                      boxSize="26px"
                      borderRadius="full"
                      objectFit="cover"
                      outline="1px solid"
                      outlineColor={active ? ACTIVE : "transparent"}
                      outlineOffset="1px"
                    />
                  )}
                  <Text fontSize="12px" textAlign="center" minW="70px" lineHeight="1" letterSpacing="0.01em" truncate maxW="full">
                    {label}
                  </Text>
                </Flex>
              </NavLink>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
