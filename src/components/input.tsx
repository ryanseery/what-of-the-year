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
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
  },
  placeholder: {
    color: theme.colors.textSecondary,
  },
}));
