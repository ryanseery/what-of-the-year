import type { Theme } from "./types";

const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const baseBorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

const baseTypography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};

const baseColors = {
  secondary: "#666666",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E0E0E0",
  error: "#DC2626",
  success: "#16A34A",
};

export const gamesTheme: Theme = {
  colors: {
    primary: "#000000",
    ...baseColors,
  },
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  typography: baseTypography,
};

export const moviesTheme: Theme = {
  colors: {
    primary: "#3B82F6",
    ...baseColors,
  },
  spacing: baseSpacing,
  borderRadius: baseBorderRadius,
  typography: baseTypography,
};

export const themes = {
  games: gamesTheme,
  movies: moviesTheme,
};
