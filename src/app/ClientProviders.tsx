"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./AuthProvider";
import ReduxProvider from "./ReduxProvider";
import { GoogleProviders } from "./googleProvider";
import { StatusProvider } from "@/context/StatusContext";
import MuiThemeProviderWrapper from "./MuiThemeProvider";

export default function ClientProviders({ children, theme }: { children: React.ReactNode; theme: "light" | "dark" }) {
  return (
    <ReduxProvider>
      <StatusProvider>
        <AuthProvider>
          <ThemeProvider>
            <ToastContainer toastStyle={{ background: theme === "dark" ? "#1d2939" : "#fff" }} theme={theme} />
            <SidebarProvider>
              <GoogleProviders>
                <MuiThemeProviderWrapper theme={theme}>{children}</MuiThemeProviderWrapper>
              </GoogleProviders>
            </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </StatusProvider>
    </ReduxProvider>
  );
}

