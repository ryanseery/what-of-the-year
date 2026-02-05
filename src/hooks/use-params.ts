import { useLocalSearchParams } from "expo-router";

import { getTopic, TOPIC_KEY } from "constants/topics";

export function useParams() {
  const params = useLocalSearchParams<{ topic?: TOPIC_KEY; year?: string }>();

  const topic = getTopic(params.topic);
  return {
    topic,
    year: params.year,
  };
}
