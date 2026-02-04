import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles } from "utils/theme";

export default function Index() {
  const s = useStyles();

  return (
    <SafeAreaView style={s.root}>
      <Text>What of the Year</Text>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
    padding: t.spacing.lg,
  },
}));
