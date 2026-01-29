import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { useTheme } from "./context";
import type { Theme } from "./types";

type Style = ViewStyle | TextStyle | ImageStyle | Record<string, unknown>;
type NamedStyles<T> = { [K in keyof T]: Style };

export function createStyles<T extends NamedStyles<T>>(stylesFn: (theme: Theme) => T) {
  return () => {
    const { theme } = useTheme();
    return stylesFn(theme) as T;
  };
}
