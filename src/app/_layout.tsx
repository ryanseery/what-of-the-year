import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { WebContainer } from "components/web-container";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { ThemeProvider } from "utils/theme";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: STALE_TIME,
    },
  },
});

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WebContainer>
          <Stack
            screenOptions={{ headerBackButtonDisplayMode: "minimal", headerShadowVisible: false }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="[topic]/index"
              options={({ route }) => {
                const params = route.params as { topic?: string } | undefined;
                const label = getTopic(params?.topic as TOPIC_KEY).label;
                return {
                  title: `${label} of the Year`,
                };
              }}
            />
            <Stack.Screen
              name="[topic]/[table]/[step]"
              options={({ route }) => {
                const params = route.params as
                  | { topic?: string; table: string; step: string }
                  | undefined;
                return {
                  title: `Round ${params?.step}`,
                };
              }}
            />
          </Stack>
        </WebContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
