import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

import { Avatar } from "components/avatar";
import { Button } from "components/button";
import { Input } from "components/input";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { useTopicData } from "queries/use-topic-data";
import { createStyles } from "utils/theme";

export default function Topic() {
  const [avatarSeed, setAvatarSeed] = useState("default");
  const [name, setName] = useState("");
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  const { key } = getTopic(topic);
  const styles = useStyles();

  const { data, isLoading, error } = useTopicData(key);

  const source = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  const disabled = name.length < 1;

  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const onSubmit = () => {
    // handle table creation
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.avatarContainer}>
        <Avatar source={source} size={120} />
        <Button label="Random" onPress={randomizeAvatar} style={styles.btn} />
        <Input
          placeholder="User name"
          value={name}
          onChangeText={(text: string) => setName(text)}
        />
        <Button label="Start" disabled={disabled} onPress={onSubmit} style={styles.btn} />
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
  avatarContainer: {
    alignItems: "center",
    gap: t.spacing.lg,
  },
  btn: {
    width: 120,
  },
}));
