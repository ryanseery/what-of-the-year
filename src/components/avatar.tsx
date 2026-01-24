import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

interface Props {
  seed: string;
  size?: number;
}

// 1. generate source higher, we'll save it in table
export function Avatar({ seed, size = 100 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
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
