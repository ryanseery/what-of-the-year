import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface Props {
  source: string;
  size?: number;
}

export function Avatar({ source, size = 100 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={{ uri: source }} style={styles.image} contentFit="cover" transition={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
