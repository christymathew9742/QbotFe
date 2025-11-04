"use client";

import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { GoogleProviders } from "./googleProvider";
import MuiThemeProviderWrapper from "./MuiThemeProvider";

export default function ClientProviders({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: "light" | "dark";
}) {
  return (
    <ThemeProvider>
      <ToastContainer
        toastStyle={{
          background: theme === "dark" ? "#1d2939" : "#fff",
        }}
        theme={theme}
      />
      <SidebarProvider>
        <GoogleProviders>
          <MuiThemeProviderWrapper theme={theme}>
            {children}
          </MuiThemeProviderWrapper>
        </GoogleProviders>
      </SidebarProvider>
    </ThemeProvider>
  );
}
