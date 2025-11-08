"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return <>{children}</>;
}

