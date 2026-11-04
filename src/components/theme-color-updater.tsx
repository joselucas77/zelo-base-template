"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeColorUpdater() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }

    const updateColor = () => {
      const isModalOpen =
        document.querySelector("[data-state='open'][role='dialog']") !== null ||
        document.querySelector("[data-vaul-drawer][data-state='open']") !== null;

      const isDark = resolvedTheme === "dark";

      if (isModalOpen) {
        metaThemeColor?.setAttribute(
          "content",
          isDark ? "#070507" : "#999999"
        );
      } else {
        metaThemeColor?.setAttribute(
          "content",
          isDark ? "#0c090c" : "#ffffff"
        );
      }
    };

    updateColor();

    const observer = new MutationObserver(() => {
      updateColor();
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  return null;
}
