import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { Input } from "components/input";
import { KeyboardAvoidingView } from "components/keyboard-avoiding-view";
import { useParams } from "hooks/use-params";
import { useTopicData } from "queries/use-topic-data";
import { createStyles } from "utils/theme";

export default function Topic() {
  const [avatarSeed, setAvatarSeed] = useState("default");
  const [name, setName] = useState("");
  const { topic, year } = useParams();
  const s = useStyles();

  const { isLoading, error } = useTopicData({ key: topic.key, year: year! });

  const source = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  const disabled = isLoading || name.length < 1;

  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const onSubmit = () => {
    // handle table creation
    console.log("onSubmit");
  };

  return (
    <KeyboardAvoidingView style={s.root}>
      <View style={s.container}>
        <View style={s.avatar}>
          <Avatar source={source} size={120} />
          <Button style={s.btn} label="Random" onPress={randomizeAvatar} />
        </View>
        <Input
          placeholder="User name"
          value={name}
          onChangeText={(text: string) => setName(text)}
        />
        <Link
          disabled={disabled}
          asChild
          href={{
            pathname: "/[topic]/[year]/[session]/[round]",
            params: { topic: topic.key, year: year!, session: "test", round: 1 },
          }}
        >
          <Button label="Start" disabled={disabled} onPress={onSubmit} />
        </Link>
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
