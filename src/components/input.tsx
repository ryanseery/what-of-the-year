import { TextInput } from "react-native";

import { createStyles } from "utils/theme";

interface Props {
  value: string;
  onChangeText?: ((text: string) => void) | undefined;
  placeholder?: string;
}
export function Input({ value, onChangeText, placeholder }: Props) {
  const styles = useStyles();
  return (
    <TextInput
      style={styles.root}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={styles.placeholder.color}
    />
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderWidth: theme.border.size.md,
    borderColor: theme.colors.primary,
    borderRadius: theme.border.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.text.size.md,
    color: theme.text.color.primary,
  },
  placeholder: {
    color: theme.text.color.secondary,
  },
}));
