import { useLocalSearchParams } from "expo-router";

import { getTopic, TOPIC_KEY } from "constants/topics";

export function useTopic() {
  const { topic } = useLocalSearchParams<{ topic?: TOPIC_KEY }>();
  return getTopic(topic);
}
