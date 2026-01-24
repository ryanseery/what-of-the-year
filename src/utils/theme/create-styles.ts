import { StyleSheet } from "react-native";

import { useTheme } from "./context";
import type { Theme } from "./types";

type NamedStyles<T> = StyleSheet.NamedStyles<T>;

export function createStyles<T extends NamedStyles<T>>(stylesFn: (theme: Theme) => T) {
  return () => {
    const { theme } = useTheme();
    return stylesFn(theme) as T;
  };
}
