import { TOPIC_KEY } from "constants/topics";

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    success: string;
  };
  spacing: {
    sm: number;
    md: number;
    lg: number;
  };
  border: {
    size: {
      sm: number;
      md: number;
      lg: number;
    };
    radius: {
      sm: number;
      md: number;
      lg: number;
    };
  };
  text: {
    color: {
      primary: string;
      secondary: string;
    };
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weight: {
      regular: "400";
      medium: "500";
      semibold: "600";
      bold: "700";
    };
  };
}

export type ThemeName = TOPIC_KEY.GAMES | TOPIC_KEY.MOVIES | TOPIC_KEY.BOOKS;
