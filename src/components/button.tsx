import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleSheet,
  Text,
} from "react-native";

import { flatten } from "utils/styles";

interface Props extends PressableProps {
  label: string;
}

export function Button({ label, style, ...pressableProps }: Props) {
  const fStyle = (state: PressableStateCallbackType) => {
    const resolvedStyle = typeof style === "function" ? style(state) : style;
    return flatten([styles.root, resolvedStyle, state.pressed && styles.pressed]);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={fStyle}
      {...pressableProps}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.7,
  },
});
