import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";
import { Share, View } from "react-native";

import { Button } from "components/button";
import { Error } from "components/error";
import { Loading } from "components/loading";
import { PlayerList } from "components/player-list";
import { startSession } from "db/start-session";
import { usePlayers } from "db/use-players";
import { useSession } from "db/use-session";
import { useParams } from "hooks/use-params";
import { createStyles } from "utils/theme";

export default function Lobby() {
  const s = useStyles();
  const { topic, year, session: sessionId } = useParams();
  const { session, isLoading: sessionLoading, error: sessionError } = useSession(sessionId);
  const { players, isHost, isLoading: playersLoading, error: playersError } = usePlayers(sessionId);

  const loading = sessionLoading || playersLoading;
  const error = sessionError || playersError;

  // Auto-navigate non-host players when game starts
  useEffect(() => {
    if (!loading && !error && session && !session.isOpen && !isHost) {
      router.replace({
        pathname: "/[topic]/[year]/[session]/[round]",
        params: { topic: topic.value, year: year!, session: sessionId!, round: "1" },
      });
    }
  }, [session?.isOpen, isHost, loading, error, topic.value, year, sessionId]);

  if (loading) return <Loading />;
  if (error || !session) return <Error />;

  const onShareInvite = async () => {
    const url = Linking.createURL(`/${topic.value}/${year}`, {
      queryParams: { session: sessionId! },
    });

    await Share.share({
      message: `Join my ${topic.label} of ${year}!\n${url}`,
    });
  };

  const onStartGame = async () => {
    await startSession({ sessionId: sessionId! });
    router.replace({
      pathname: "/[topic]/[year]/[session]/[round]",
      params: { topic: topic.value, year: year!, session: sessionId!, round: "1" },
    });
  };

  const disabled = players.length < 2;

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Button style={s.shareBtn} label="Share Invite" onPress={onShareInvite} />
      </View>

      <PlayerList data={players} />

      {isHost && (
        <View style={s.footer}>
          <Button label="Start" onPress={onStartGame} disabled={disabled} />
        </View>
      )}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  header: {
    alignItems: "center",
    paddingBottom: t.spacing.md,
  },
  shareBtn: {
    width: 200,
  },
  footer: {
    padding: t.spacing.lg,
  },
}));
