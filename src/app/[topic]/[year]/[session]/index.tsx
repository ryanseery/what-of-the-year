import { Text, View } from "react-native";

import { createStyles } from "utils/theme";

export default function Lobby() {
  const s = useStyles();
  return (
    <View style={s.root}>
      <Text>Lobby</Text>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: t.colors.background,
    paddingHorizontal: t.spacing.md,
  },
}));
