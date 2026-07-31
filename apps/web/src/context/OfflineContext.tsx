'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  toggleOffline: () => {},
});

export const useOffline = () => useContext(OfflineContext);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Load state from localStorage on initial render
    const savedState = localStorage.getItem('akems_offline_mode');
    if (savedState) {
      setIsOffline(savedState === 'true');
    }
  }, []);

  const toggleOffline = () => {
    setIsOffline((prev) => {
      const newState = !prev;
      localStorage.setItem('akems_offline_mode', String(newState));
      return newState;
    });
  };

  return (
    <OfflineContext.Provider value={{ isOffline, toggleOffline }}>
      {children}
    </OfflineContext.Provider>
  );
}
