import { Pressable, PressableProps, PressableStateCallbackType, Text } from "react-native";

import { flatten } from "utils/styles";
import { createStyles } from "utils/theme";

interface Props extends PressableProps {
  label: string;
}

export function Button({ label, style, ...pressableProps }: Props) {
  const styles = useStyles();
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

const useStyles = createStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.colors.primary,
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
}));
