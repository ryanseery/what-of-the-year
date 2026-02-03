import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createStyles } from "utils/theme";

export default function Index() {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.root}>
      <Text>GAME</Text>
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
