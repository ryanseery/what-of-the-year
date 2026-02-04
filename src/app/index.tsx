import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "components/button";
import { Picker } from "components/picker";
import { TOPIC_KEY, topics } from "constants/topics";
import { createStyles, useTheme } from "utils/theme";

export default function Index() {
  const [topic, setTopic] = useState<TOPIC_KEY>(TOPIC_KEY.GAMES);
  const { setTheme } = useTheme();
  const s = useStyles();

  const onValueChange = (v: TOPIC_KEY) => {
    setTopic(v);
    setTheme(v);
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.content}>
        <Picker topics={topics} topic={topic} onValueChange={onValueChange} />
        <Text style={s.ofTheText}>of the</Text>
        <Text style={s.yearText}>Year</Text>
      </View>

      <Link
        asChild
        href={{
          pathname: "/[topic]",
          params: { topic },
        }}
      >
        <Button label="Start" />
      </Link>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
    padding: t.spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ofTheText: {
    fontSize: 52,
    fontWeight: t.text.weight.bold,
    color: t.text.color.primary,
    marginVertical: t.spacing.md,
  },
  yearText: {
    fontSize: 72,
    fontWeight: t.text.weight.bold,
    color: t.text.color.primary,
  },
}));
