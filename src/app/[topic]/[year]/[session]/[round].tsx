import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Error } from "components/error";
import { Loading } from "components/loading";
import { RoundDrawer } from "components/round-drawer";
import { usePlayers } from "db/use-players";
import { useRound } from "db/use-round";
import { useSelections } from "db/use-selections";
import { useSession } from "db/use-session";
import { useParams } from "hooks/use-params";
import { createStyles } from "utils/theme";

export default function Round() {
  const s = useStyles();
  const { topic, year, session: sessionId, round: roundParam } = useParams();
  const roundNumber = roundParam ? parseInt(roundParam, 10) : undefined;

  const [drawerVisible, setDrawerVisible] = useState(false);

  const { session, isLoading: sessionLoading, error: sessionError } = useSession(sessionId);
  const { round, isLoading: roundLoading, error: roundError } = useRound(sessionId, roundNumber);
  const { players, isHost, isLoading: playersLoading, error: playersError } = usePlayers(sessionId);
  const {
    selections,
    isLoading: selectionsLoading,
    error: selectionsError,
  } = useSelections(sessionId, roundNumber);

  const loading = sessionLoading || roundLoading || playersLoading || selectionsLoading;
  const error = sessionError || roundError || playersError || selectionsError;

  // Sync URL with session.activeRoundNumber
  useEffect(() => {
    if (session && roundNumber && session.activeRoundNumber !== roundNumber) {
      router.replace({
        pathname: "/[topic]/[year]/[session]/[round]",
        params: {
          topic: topic.value,
          year: year!,
          session: sessionId!,
          round: String(session.activeRoundNumber),
        },
      });
    }
  }, [session?.activeRoundNumber, roundNumber, topic.value, year, sessionId]);

  if (loading) return <Loading />;
  if (error) return <Error />;
  if (!session || !round || !roundNumber) return <Error />;

  const completedUids = new Set(selections.map((s) => s.uid));

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={() => setDrawerVisible(true)} hitSlop={8}>
              <Text style={s.menuBtn}>☰</Text>
            </Pressable>
          ),
          title: `Round ${roundNumber} of ${session.maxRounds}`,
        }}
      />
      <SafeAreaView style={s.root}>
        <Text>Round {roundNumber} - TODO: Implement picking UI</Text>
      </SafeAreaView>

      <RoundDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        players={players}
        completedUids={completedUids}
        isHost={isHost}
        sessionId={sessionId!}
        roundNumber={roundNumber}
        maxRounds={session.maxRounds}
      />
    </>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: t.spacing.lg,
  },
  menuBtn: {
    fontSize: t.text.size.xxl,
    color: t.text.color.primary,
    paddingHorizontal: t.spacing.md,
  },
}));
