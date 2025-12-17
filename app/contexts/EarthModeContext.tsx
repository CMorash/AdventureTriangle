'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface EarthModeContextType {
  isEarthMode: boolean;
  toggleEarthMode: () => void;
  setEarthMode: (value: boolean) => void;
}

const EarthModeContext = createContext<EarthModeContextType | undefined>(undefined);

export function EarthModeProvider({ children }: { children: ReactNode }) {
  const [isEarthMode, setIsEarthMode] = useState(false);

  const toggleEarthMode = useCallback(() => {
    setIsEarthMode(prev => !prev);
  }, []);

  const setEarthModeValue = useCallback((value: boolean) => {
    setIsEarthMode(value);
  }, []);

  // Handle scroll lock when in earth mode
  useEffect(() => {
    if (isEarthMode) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Re-enable scrolling and restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isEarthMode]);

  return (
    <EarthModeContext.Provider value={{ isEarthMode, toggleEarthMode, setEarthMode: setEarthModeValue }}>
      {children}
    </EarthModeContext.Provider>
  );
}

export function useEarthMode() {
  const context = useContext(EarthModeContext);
  if (context === undefined) {
    throw new Error('useEarthMode must be used within an EarthModeProvider');
  }
  return context;
}
