import { TextInput } from "react-native";

import { createStyles } from "utils/theme";

interface Props {
  value: string;
  onChangeText?: ((text: string) => void) | undefined;
  placeholder?: string;
}
export function Input({ value, onChangeText, placeholder }: Props) {
  const s = useStyles();
  return (
    <TextInput
      style={s.root}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={s.placeholder.color}
    />
  );
}

const useStyles = createStyles((t) => ({
  root: {
    width: "100%",
    backgroundColor: t.colors.surface,
    borderWidth: t.border.size.md,
    borderColor: t.colors.primary,
    borderRadius: t.border.radius.md,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
    fontSize: t.text.size.md,
    color: t.text.color.primary,
  },
  placeholder: {
    color: t.text.color.secondary,
  },
}));
