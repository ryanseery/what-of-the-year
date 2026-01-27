import { Image } from "expo-image";
import { View } from "react-native";

import { createStyles } from "utils/theme";

interface Props {
  source: string;
  size?: number;
}

export function Avatar({ source, size = 100 }: Props) {
  const styles = useStyles();
  return (
    <View style={[styles.root, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={{ uri: source }} style={styles.image} contentFit="cover" transition={200} />
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    overflow: "hidden",
    backgroundColor: theme.colors.background,
  },
  image: {
    width: "100%",
    height: "100%",
  },
}));
