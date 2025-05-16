"use client";

import React, { useEffect } from "react";
import { configure } from "@/auth/auth";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthWrapperProps) {

  useEffect(() => {
    if (typeof window === "undefined") return;

    configure("dl-aiapp-abc123xyz456", (token:string) => {
      console.debug(`Session initialized with token: ${token}`);
    });
  }, []); 

  return <>{children}</>;
}
