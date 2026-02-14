import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { Error } from "components/error";
import { Input } from "components/input";
import { KeyboardAvoidingView } from "components/keyboard-avoiding-view";
import { createSession } from "db/create-session";
import { joinSession } from "db/join-session";
import { useAuth } from "db/use-auth";
import { useParams } from "hooks/use-params";
import { useRandomAvatar } from "hooks/use-random-avatar";
import { useTopicData } from "queries/use-topic-data";
import { createStyles } from "utils/theme";

export default function Topic() {
  const s = useStyles();
  const headerHeight = useHeaderHeight();
  const { topic, year, session: existingSessionId } = useParams();
  const { isLoading, isError, refetch } = useTopicData({ key: topic.value, year: year! });
  const { avatar, randomizeAvatar } = useRandomAvatar();
  const [name, setName] = useState("");
  const { mutateAsync: signIn, isPending } = useAuth();

  const isJoining = !!existingSessionId;
  const disabled = isLoading || isPending || name.length < 1;

  const onSubmit = async () => {
    try {
      const user = await signIn();

      let sessionId: string;

      if (isJoining && existingSessionId) {
        try {
          await joinSession({
            sessionId: existingSessionId,
            uid: user.uid,
            name,
            avatar,
          });
        } catch (e: unknown) {
          const error = e as Error;
          if (error.message !== "Already joined this session") throw e;
        }
        sessionId = existingSessionId;
      } else {
        const result = await createSession({
          topic: topic.value,
          year: Number(year),
          uid: user.uid,
          name,
          avatar,
        });
        sessionId = result.sessionId;
      }

      router.replace({
        pathname: "/[topic]/[year]/[session]",
        params: { topic: topic.value, year: year!, session: sessionId, round: "1" },
      });
    } catch (e) {
      // oxlint-disable-next-line no-console
      console.error("Failed to submit:", e);
    }
  };

  const onChangeText = (text: string) => setName(text);

  const label = isPending ? "Loading..." : isJoining ? "Join" : "Create";

  if (isError) return <Error onRetry={refetch} />;

  return (
    <KeyboardAvoidingView style={s.root} keyboardVerticalOffset={headerHeight}>
      <View style={[s.container, { marginTop: -headerHeight / 2 }]}>
        <View style={s.avatar}>
          <Avatar source={avatar} size={120} />
          <Button style={s.btn} label="Random" onPress={randomizeAvatar} />
        </View>
        <Input placeholder="User name" value={name} onChangeText={onChangeText} />
        <Button label={label} disabled={disabled} onPress={onSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: t.colors.background,
    paddingHorizontal: t.spacing.md,
  },
  container: {
    alignItems: "center",
    gap: t.spacing.lg,
  },
  avatar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    width: 120,
  },
}));
