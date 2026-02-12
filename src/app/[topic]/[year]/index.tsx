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
import { useTopicData } from "queries/use-topic-data";
import { createStyles } from "utils/theme";

export default function Topic() {
  const [avatarSeed, setAvatarSeed] = useState("default");
  const [name, setName] = useState("");
  const { topic, year, session: existingSessionId } = useParams();
  const { mutateAsync: signIn, isPending } = useAuth();
  const s = useStyles();
  const headerHeight = useHeaderHeight();

  const { isLoading, isError, refetch } = useTopicData({ key: topic.key, year: year! });

  const source = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  const isJoining = !!existingSessionId;
  const disabled = isLoading || isPending || name.length < 1;

  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const onSubmit = async () => {
    try {
      const user = await signIn();

      let sessionId: string;

      if (isJoining && existingSessionId) {
        const result = await joinSession({
          sessionId: existingSessionId,
          uid: user.uid,
          name,
          avatar: source,
        });
        sessionId = result.sessionId;
      } else {
        const result = await createSession({
          topic: topic.key,
          year: Number(year),
          uid: user.uid,
          name,
          avatar: source,
        });
        sessionId = result.sessionId;
      }

      router.replace({
        pathname: "/[topic]/[year]/[session]",
        params: { topic: topic.key, year: year!, session: sessionId, round: "1" },
      });
    } catch (e) {
      console.error("Failed to submit:", e);
    }
  };

  if (isError) {
    return <Error onRetry={refetch} />;
  }

  return (
    <KeyboardAvoidingView style={s.root} keyboardVerticalOffset={headerHeight}>
      <View style={[s.container, { marginTop: -headerHeight / 2 }]}>
        <View style={s.avatar}>
          <Avatar source={source} size={120} />
          <Button style={s.btn} label="Random" onPress={randomizeAvatar} />
        </View>
        <Input
          placeholder="User name"
          value={name}
          onChangeText={(text: string) => setName(text)}
        />
        <Button
          label={isPending ? "Loading..." : isJoining ? "Join" : "Create"}
          disabled={disabled}
          onPress={onSubmit}
        />
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
