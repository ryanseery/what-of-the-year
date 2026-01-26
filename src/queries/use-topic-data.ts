import { useBooks } from "./use-books";
import { useGames } from "./use-games";
import { useMovies } from "./use-movies";
import { TOPIC_KEY } from "constants/topics";

export function useTopicData(key: TOPIC_KEY) {
  const { data: gData, isLoading: gLoading, error: gError } = useGames(key);

  const { data: mData, isLoading: mLoading, error: mError } = useMovies(key);

  const { data: bData, isLoading: bLoading, error: bError } = useBooks(key);

  return {
    data: gData || mData || bData,
    isLoading: gLoading || mLoading || bLoading,
    error: gError || mError || bError,
  };
}
