import { StyleSheet, type StyleProp } from "react-native";

export const flatten = <T>(style: StyleProp<T> | undefined) =>
  StyleSheet.flatten(style) as T | undefined;
