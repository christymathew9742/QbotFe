import React from "react";
import GridShape from "@/components/common/GridShape";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 z-1 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          <div className="lg:w-1/2 w-full h-full  dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <GridShape /> */}
              <div className="flex flex-col items-center max-w-xs">
              </div>
            </div>
          </div>
          <div className="w-full sm:basis-3/5 bg-opacity-50 p-8 lg:px-[100px] flex flex-col justify-start overflow-auto relative " >
            <div className="-top-4 left-0 absolute ">
              <img src="images/login/app-logo.png" alt="App Logo " className="w-[30%]" />
            </div>
            {children}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
