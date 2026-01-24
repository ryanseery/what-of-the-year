import { ActivityIndicator, ActivityIndicatorProps, StyleSheet, View } from "react-native";

interface Props extends ActivityIndicatorProps {}

export function Loading({ size = "large", ...props }: Props) {
  return (
    <View style={styles.root}>
      <ActivityIndicator size={size} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
