import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Share, View } from "react-native";

import { LobbyProps } from "./types";
import { useLobbyState } from "./use-lobby-state";
import { Button } from "components/button";
import { Error } from "components/error";
import { Loading } from "components/loading";
import { PlayerList } from "components/player-list";
import { startSession } from "db/start-session";
import { createStyles } from "utils/theme";

export function Lobby({ topic, year, sessionId }: LobbyProps) {
  const s = useStyles();
  const { isLoading, error, session, players, isHost, canStart } = useLobbyState({
    topic,
    year,
    sessionId,
  });

  if (isLoading) return <Loading />;
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

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Button style={s.shareBtn} label="Share Invite" onPress={onShareInvite} />
      </View>

      <PlayerList data={players} />

      {isHost && (
        <View style={s.footer}>
          <Button label="Start" onPress={onStartGame} disabled={canStart} />
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
