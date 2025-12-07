import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
        <div className="hidden sm:flex sm:w-1/2 relative items-center h-full">
          <div className="relative z-10 w-full h-auto">
            <img 
              src="/images/login/loginbg.jpeg" 
              alt="Login Illustration" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        <div className="w-full sm:basis-3/5 bg-opacity-50 p-8 lg:px-[100px] flex flex-col items-center overflow-auto relative" >
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}