import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { useBooks } from "queries/use-books";
import { useGames } from "queries/use-games";
import { useMovies } from "queries/use-movies";

export default function Topic() {
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  const { key } = getTopic(topic);
  const [avatarSeed, setAvatarSeed] = useState("default");

  const { data: gData, isLoading: gLoading, error: gError } = useGames(key);

  const { data: mData, isLoading: mLoading, error: mError } = useMovies(key);

  const { data: bData, isLoading: bLoading, error: bError } = useBooks(key);

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
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
});
