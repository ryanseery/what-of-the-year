import { Pressable, PressableProps, PressableStateCallbackType, Text } from "react-native";

import { flatten } from "utils/styles";
import { createStyles } from "utils/theme";

interface Props extends PressableProps {
  label: string;
}

export function Button({ label, style, disabled, ...props }: Props) {
  const styles = useStyles();
  const fStyle = (state: PressableStateCallbackType) => {
    const resolvedStyle = typeof style === "function" ? style(state) : style;
    return flatten([
      styles.root,
      resolvedStyle,
      !disabled && state.pressed && styles.pressed,
      disabled && styles.disabled,
    ]);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={fStyle}
      disabled={disabled}
      {...props}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    width: "100%",
    alignItems: "center",
    backgroundColor: t.colors.primary,
    borderRadius: t.border.radius.lg,
    paddingVertical: t.spacing.md,
  },
  text: {
    color: "#fff",
    fontSize: t.text.size.xl,
    fontWeight: t.text.weight.bold,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
}));
