import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from "components/loading";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { useBooks } from "queries/use-books";
import { useGames } from "queries/use-games";
import { useMovies } from "queries/use-movies";

export default function Topic() {
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  const determinedTopic = getTopic(topic);

  const {
    data: gamesData,
    isLoading: gamesLoading,
    error: gameError,
  } = useGames(determinedTopic.key === TOPIC_KEY.GAMES);

  const {
    data: moviesData,
    isLoading: moviesLoading,
    error: moviesError,
  } = useMovies(determinedTopic.key === TOPIC_KEY.MOVIES);

  const {
    data: booksData,
    isLoading: booksLoading,
    error: booksError,
  } = useBooks(determinedTopic.key === TOPIC_KEY.BOOKS);

  const isLoading = gamesLoading || moviesLoading || booksLoading;

  if (isLoading) {
    return <Loading color={determinedTopic.color} />;
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
    <SafeAreaView style={styles.root}>
      <Text style={[styles.text, { color: determinedTopic.color }]}>{determinedTopic.label}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 56,
    fontWeight: "bold",
  },
});
