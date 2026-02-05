import { useBooks } from "./use-books";
import { useGames } from "./use-games";
import { useMovies } from "./use-movies";
import { QUERY_ARGS } from "types/query-args";

export function useTopicData(args: QUERY_ARGS) {
  const { data: gData, isLoading: gLoading, error: gError } = useGames(args);

  const { data: mData, isLoading: mLoading, error: mError } = useMovies(args);

  const { data: bData, isLoading: bLoading, error: bError } = useBooks(args);

  return {
    data: gData || mData || bData,
    isLoading: gLoading || mLoading || bLoading,
    error: gError || mError || bError,
  };
}
