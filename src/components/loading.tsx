import { ActivityIndicator, ColorValue, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  color?: ColorValue | undefined;
}
export function Loading({ color }: Props) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={color} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
