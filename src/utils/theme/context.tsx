import React, { createContext, useContext, useState, type ReactNode } from "react";

import { themes } from "./themes";
import type { Theme, ThemeName } from "./types";
import { TOPIC_KEY } from "constants/topics";

interface ThemeContextValue {
  theme: Theme;
  themeName: TOPIC_KEY;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeName;
}

export function ThemeProvider({ children, initialTheme = TOPIC_KEY.GAMES }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<TOPIC_KEY>(initialTheme);

  const value: ThemeContextValue = {
    theme: themes[themeName],
    themeName,
    setTheme: setThemeName,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
