"use client";

import React, { useEffect, useState } from "react";

interface InternetStatusWrapperProps {
  children: React.ReactNode;
}

const InternetStatusWrapper: React.FC<InternetStatusWrapperProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (!isOnline) return null;

  return <>{children}</>;
};

export default InternetStatusWrapper;
