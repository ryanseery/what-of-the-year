import { useLocalSearchParams } from "expo-router";

import { getTopic, TOPIC_KEY } from "constants/topics";

export type Params = {
  topic?: TOPIC_KEY;
  year?: string;
  session?: string;
  round?: string;
};

export function useParams() {
  const params = useLocalSearchParams<Params>();
  const { topic: paramsTopic, ...rest } = params;
  const topic = getTopic(paramsTopic);
  return {
    ...rest,
    topic,
  };
}
