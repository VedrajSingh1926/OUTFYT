import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface QuickGenerateContextValue {
  isOpen: boolean;
  openQuickGenerate: () => void;
  closeQuickGenerate: () => void;
}

const QuickGenerateContext = createContext<QuickGenerateContextValue | null>(null);

export function QuickGenerateProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuickGenerate = useCallback(() => setIsOpen(true), []);
  const closeQuickGenerate = useCallback(() => setIsOpen(false), []);

  return (
    <QuickGenerateContext.Provider value={{ isOpen, openQuickGenerate, closeQuickGenerate }}>
      {children}
    </QuickGenerateContext.Provider>
  );
}

export function useQuickGenerate() {
  const ctx = useContext(QuickGenerateContext);
  if (!ctx) throw new Error('useQuickGenerate must be used within QuickGenerateProvider');
  return ctx;
}
