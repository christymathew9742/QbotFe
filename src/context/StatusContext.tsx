"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define types for context value
interface StatusContextType {
  status: boolean;
  setStatus: (value: boolean) => void;
}

// Create context with default undefined (to enforce provider usage)
const StatusContext = createContext<StatusContextType | undefined>(undefined);

interface StatusProviderProps {
  children: ReactNode;
}

// Provider component
export const StatusProvider = ({ children }: StatusProviderProps) => {
  const [status, setStatus] = useState(false);

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};

// Custom hook to consume context
export const useStatus = (): StatusContextType => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error("useStatus must be used within a StatusProvider");
  }
  return context;
};
