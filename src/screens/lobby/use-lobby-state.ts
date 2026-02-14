import { router } from "expo-router";
import { useEffect } from "react";

import { LobbyProps } from "./types";
import { usePlayers } from "db/use-players";
import { useSession } from "db/use-session";

/**
 * Composite hook for managing lobby state.
 *
 * Combines session and player data, handles loading/error states,
 * and automatically navigates non-host players to round 1 when the host starts the game.
 */
export function useLobbyState({ sessionId, topic, year }: LobbyProps) {
  const { session, isLoading: sessionLoading, error: sessionError } = useSession(sessionId);
  const { players, isHost, isLoading: playersLoading, error: playersError } = usePlayers(sessionId);

  const isLoading = sessionLoading || playersLoading;
  const error = sessionError || playersError;

  const canStart = players.length < 2;

  // Auto-navigate non-host players when game starts
  useEffect(() => {
    if (!isLoading && !error && session && !session.isOpen && !isHost) {
      router.replace({
        pathname: "/[topic]/[year]/[session]/[round]",
        params: { topic: topic.value, year, session: sessionId, round: "1" },
      });
    }
  }, [session?.isOpen, isHost, isLoading, error, topic.value, year, sessionId]);

  return { isLoading, error, session, players, isHost, canStart };
}
