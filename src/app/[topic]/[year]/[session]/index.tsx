import * as Linking from "expo-linking";
import { FlatList, Share, Text, View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { Error } from "components/error";
import { Loading } from "components/loading";
import { auth } from "db/config";
import { usePlayers } from "db/use-players";
import { useSession } from "db/use-session";
import { useParams } from "hooks/use-params";
import { createStyles } from "utils/theme";

export default function Lobby() {
  const s = useStyles();
  const { topic, year, session: sessionId } = useParams();
  const { session, isLoading: sessionLoading, error: sessionError } = useSession(sessionId);
  const { players, isLoading: playersLoading, error: playersError } = usePlayers(sessionId);

  const currentUid = auth.currentUser?.uid;
  const isHost = players.some((p) => p.uid === currentUid && p.isHost);

  if (sessionLoading || playersLoading) return <Loading />;
  if (sessionError || playersError) return <Error />;
  if (!session) return <Error />;

  const onShareInvite = async () => {
    const url = Linking.createURL(`/${topic.value}/${year}`, {
      queryParams: { session: sessionId! },
    });

    await Share.share({
      message: `Join my ${topic.label} of ${year}!\n${url}`,
    });
  };

  const onStartGame = () => {
    // TODO: start game — close session + navigate to round 1
  };

  const disabled = players.length < 2;

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Button style={s.shareBtn} label="Share Invite" onPress={onShareInvite} />
      </View>

      <FlatList
        data={players}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.playerRow}>
            <Avatar source={item.avatar} size={48} />
            <Text style={s.playerName}>{item.name}</Text>
            {item.isHost && <Text style={s.hostBadge}>Host</Text>}
          </View>
        )}
        ListFooterComponent={
          <Text style={s.count}>
            {players.length} / {session.maxPlayers} players
          </Text>
        }
      />

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
  list: {
    paddingHorizontal: t.spacing.md,
    gap: t.spacing.sm,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.colors.surface,
    padding: t.spacing.sm,
    borderRadius: t.border.radius.lg,
    gap: t.spacing.md,
  },
  playerName: {
    flex: 1,
    fontSize: t.text.size.lg,
    fontWeight: t.text.weight.medium,
  },
  hostBadge: {
    fontSize: t.text.size.sm,
    fontWeight: t.text.weight.semibold,
    color: t.colors.primary,
  },
  count: {
    textAlign: "center",
    fontSize: t.text.size.sm,
    color: t.text.color.secondary,
    paddingTop: t.spacing.md,
  },
  footer: {
    padding: t.spacing.lg,
  },
}));
