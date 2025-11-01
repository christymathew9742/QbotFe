"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Cookies from "universal-cookie";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const cookies = new Cookies();

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  const [theme, setTheme] = useState<Theme>("light");

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    if (isAuthPage) {
      document.documentElement.classList.remove("dark", "light");
      return;
    }

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme: Theme = systemPrefersDark ? "dark" : "light";
    applyTheme(initialTheme);
    cookies.set("theme", initialTheme);

    // Listen to system theme changes dynamically
    const listener = (e: MediaQueryListEvent) => {
      applyTheme(e.matches ? "dark" : "light");
      cookies.set("theme", e.matches ? "dark" : "light");
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", listener);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", listener);
    };
  }, [pathname]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

