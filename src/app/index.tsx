import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "components/button";
import { TOPIC_KEY, topics } from "constants/topics";
import { createStyles, useTheme } from "utils/theme";

// 1. picker is borked on web
export default function Index() {
  const [topic, setTopic] = useState<TOPIC_KEY>(TOPIC_KEY.GAMES);
  const { setTheme } = useTheme();
  const styles = useStyles();

  const onValueChange = (v: TOPIC_KEY) => {
    setTopic(v);
    setTheme(v);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={topic} itemStyle={styles.pickerItem} onValueChange={onValueChange}>
            {topics.map((t) => (
              <Picker.Item key={t.key} label={t.label} value={t.key} />
            ))}
          </Picker>
        </View>
        <Text style={styles.ofTheText}>of the</Text>
        <Text style={styles.yearText}>Year</Text>
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

const useStyles = createStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerContainer: {
    width: "100%",
    overflow: "hidden",
  },
  pickerItem: {
    fontSize: 72,
    fontWeight: "bold",
    height: 88,
    color: theme.colors.primary,
  },
  ofTheText: {
    fontSize: 52,
    fontWeight: "700",
    color: theme.colors.text,
    marginVertical: 16,
  },
  yearText: {
    fontSize: 72,
    fontWeight: "bold",
    color: theme.colors.text,
  },
}));
