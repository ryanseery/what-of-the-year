import { Platform, View } from "react-native";

import { createStyles } from "utils/theme";

export function WebContainer({ children }: { children: React.ReactNode }) {
  const styles = useStyles();

  if (Platform.OS !== "web") return <>{children}</>;

  return (
    <View style={styles.root}>
      <View style={styles.container}>{children}</View>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: t.colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
}));
