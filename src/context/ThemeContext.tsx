// "use client";

// import type React from "react";
// import { createContext, useState, useContext, useEffect } from "react";
// import Cookies from 'universal-cookie';


// type Theme = "light" | "dark";

// type ThemeContextType = {
//   theme: Theme;
//   toggleTheme: () => void;
// };

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// const cookies = new Cookies();

// export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [theme, setTheme] = useState<Theme>("light");
//   const [isInitialized, setIsInitialized] = useState(false);
  
//   useEffect(() => {
//     const savedTheme =  cookies.get('theme') as Theme | undefined;
//     const initialTheme = savedTheme || "light"; // Default to light theme

//     setTheme(initialTheme);
//     setIsInitialized(true);
//   }, []);

//   useEffect(() => {
//     if (isInitialized) {
//       cookies.set('theme', theme);
//       if (theme === "dark") {
//         document.documentElement.classList.add("dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//       }
//     }
//   }, [theme, isInitialized]);

//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };

"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const cookies = new Cookies();

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  useEffect(() => {
    if (isAuthPage) {
      setTheme("light");
      setIsInitialized(true);
    } else {
      const savedTheme = cookies.get("theme") as Theme | undefined;
      const initialTheme = savedTheme || "light";
      setTheme(initialTheme);
      setIsInitialized(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthPage) {
      document.documentElement.classList.remove("dark");
      return;
    }

    cookies.set("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme, isInitialized, pathname]);

  const toggleTheme = () => {
    if (isAuthPage) return;
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
