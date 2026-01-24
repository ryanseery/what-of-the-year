import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "components/button";
import { getTopic, TOPIC_KEY, topics } from "constants/topics";

const fontColor = "#333";

export default function Index() {
  const [topic, setTopic] = useState<TOPIC_KEY>(TOPIC_KEY.GAMES);

  const onValueChange = (v: TOPIC_KEY) => setTopic(v);

  const determinedTopic = getTopic(topic);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={topic}
            itemStyle={[styles.pickerItem, { color: determinedTopic.color }]}
            onValueChange={onValueChange}
          >
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
        <Button label="Start" style={{ backgroundColor: determinedTopic.color }} />
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  ofTheText: {
    fontSize: 52,
    fontWeight: "700",
    color: fontColor,
    marginVertical: 16,
  },
  yearText: {
    fontSize: 72,
    fontWeight: "bold",
    color: fontColor,
  },
});
