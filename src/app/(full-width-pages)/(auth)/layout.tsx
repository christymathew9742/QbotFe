import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-white dark:bg-gray-900 overflow-hidden  bg-[url('/images/login/hero_bg.png')] bg-no-repeat bg-cover bg-bottom">
        <div className="hidden sm:flex sm:w-[70%] relative items-center h-full bg-gradient-to-r from-[#493e8136] to-transparent">
          <div className="relative z-10 w-full h-auto ">
            <img 
              src="/images/login/loginbg.png" 
              alt="Login Illustration" 
              className="w-full h-full object-cover mb-8" 
            />
            <div className="absolute bottom-0 left-5 flex items-center gap-3">
              <img
                src="/images/logo/app-logo.png"
                alt="Qbot Logo"
                className="h-10 w-auto"
              />
              <span className="text-xl font-normal text-[#493e81d6] dark:text-gray-200 [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.15)]">
                Smart AI assistant designed to automate appointments.
              </span>
            </div>
          </div> 
        </div>
        <div className="w-full sm:basis-3/5 bg-opacity-50 p-8 lg:px-[100px] flex flex-col items-center overflow-auto relative" >
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}