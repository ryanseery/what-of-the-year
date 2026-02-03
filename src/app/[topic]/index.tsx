import { Link } from "expo-router";
import { useState } from "react";
import { Platform, View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { Input } from "components/input";
import { KeyboardAvoidingView } from "components/keyboard-avoiding-view";
import { useTopic } from "hooks/use-topic";
import { useTopicData } from "queries/use-topic-data";
import { createStyles } from "utils/theme";

export default function Topic() {
  const [avatarSeed, setAvatarSeed] = useState("default");
  const [name, setName] = useState("");
  const topic = useTopic();
  const styles = useStyles();

  const { data, isLoading, error } = useTopicData(topic.key);

  const source = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  const disabled = name.length < 1;

  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const onSubmit = () => {
    // handle table creation
    console.log("onSubmit");
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Avatar source={source} size={120} />
          <Button label="Random" onPress={randomizeAvatar} style={styles.btn} />
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
            pathname: "/[topic]/[table]/[step]",
            params: { topic: topic.label, table: "test", step: "1" },
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
