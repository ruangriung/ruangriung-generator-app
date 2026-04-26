'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface UIContextType {
  isHelpOpen: boolean;
  setIsHelpOpen: (isOpen: boolean) => void;
  openHelp: () => void;
  closeHelp: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openHelp = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);

  return (
    <UIContext.Provider value={{ 
      isHelpOpen, 
      setIsHelpOpen, 
      openHelp, 
      closeHelp 
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
