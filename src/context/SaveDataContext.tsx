import React, { createContext, useContext, useState, useCallback } from "react";

type SaveEventContextType = {
  triggerSave: () => void;
  lastSaveTime: number;
  onSaveCallbacks: (() => void)[];
  registerOnSave: (fn: () => void) => void;
};

const SaveEventContext = createContext<SaveEventContextType | undefined>(undefined);

export const SaveEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [onSaveCallbacks, setOnSaveCallbacks] = useState<(() => void)[]>([]);

  const triggerSave = useCallback(() => {
    setLastSaveTime(Date.now());
    onSaveCallbacks.forEach(fn => fn());
  }, [onSaveCallbacks]);

  const registerOnSave = useCallback((fn: () => void) => {
    setOnSaveCallbacks(prev => [...prev, fn]);
  }, []);

  return (
    <SaveEventContext.Provider value={{ triggerSave, lastSaveTime, registerOnSave, onSaveCallbacks }}>
      {children}
    </SaveEventContext.Provider>
  );
};

export const useSaveEvent = (): SaveEventContextType => {
  const context = useContext(SaveEventContext);
  if (!context) throw new Error("useSaveEvent must be used within SaveEventProvider");
  return context;
};


