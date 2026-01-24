import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Loading } from "components/loading";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { useBooks } from "queries/use-books";
import { useGames } from "queries/use-games";
import { useMovies } from "queries/use-movies";

export default function Topic() {
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  const { key, color, label } = getTopic(topic);

  const { data: gData, isLoading: gLoading, error: gError } = useGames(key);

  const { data: mData, isLoading: mLoading, error: mError } = useMovies(key);

  const { data: bData, isLoading: bLoading, error: bError } = useBooks(key);

  const isLoading = gLoading || mLoading || bLoading;

  if (isLoading) return <Loading color={color} />;

  console.log({
    gData,
    gLoading,
    gError,
    mData,
    mLoading,
    mError,
    bData,
    bLoading,
    bError,
  });

  return (
    <View style={styles.root}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 56,
    fontWeight: "bold",
  },
});
