"use client";

import { createContext, useContext } from "react";

export type FocusModeContextValue = {
  focusMode: boolean;
  setFocusMode: (value: boolean) => void;
  toggleFocusMode: () => void;
};

const FocusModeContext = createContext<FocusModeContextValue | null>(null);

export function FocusModeProvider({ value, children }: { value: FocusModeContextValue; children: React.ReactNode }) {
  return <FocusModeContext.Provider value={value}>{children}</FocusModeContext.Provider>;
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (!context) {
    throw new Error("useFocusMode must be used within a FocusModeProvider");
  }
  return context;
}
