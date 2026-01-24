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

  const { data: gamesData, isLoading: gamesLoading, error: gameError } = useGames(key);

  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = useMovies(key);

  const { data: booksData, isLoading: booksLoading, error: booksError } = useBooks(key);

  const isLoading = gamesLoading || moviesLoading || booksLoading;

  if (isLoading) {
    return <Loading color={color} />;
  }

  console.log({
    gamesData,
    gamesLoading,
    gameError,
    moviesData,
    moviesLoading,
    moviesError,
    booksData,
    booksLoading,
    booksError,
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
