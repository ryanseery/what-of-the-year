import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { useTopicData } from "queries/use-topic-data";
import { createStyles } from "utils/theme";

export default function Topic() {
  const [avatarSeed, setAvatarSeed] = useState("default");
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  const { key } = getTopic(topic);
  const styles = useStyles();

  const { data, isLoading, error } = useTopicData(key);

  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  return (
    <View style={styles.root}>
      <View style={styles.avatarContainer}>
        <Avatar seed={avatarSeed} size={120} />
        <Button label="Random" onPress={randomizeAvatar} style={styles.randomButton} />
      </View>
    </View>
  );
}

const useStyles = createStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  avatarContainer: {
    alignItems: "center",
    gap: 16,
  },
  randomButton: {
    width: 120,
  },
}));
