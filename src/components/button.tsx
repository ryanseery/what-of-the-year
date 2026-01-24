import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { flatten } from "utils/styles";

interface Props {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}
export function Button({ label, onPress, style }: Props) {
  const fStyle = ({ pressed }: PressableStateCallbackType) =>
    flatten([styles.root, pressed && styles.pressed, style]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={fStyle}
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
  pressed: {
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
