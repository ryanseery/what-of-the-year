import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { WebContainer } from "components/web-container";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { Params } from "hooks/use-params";
import { STALE_TIME } from "queries/utils";
import { ThemeProvider } from "utils/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: STALE_TIME,
    },
  },
});

export default function Root() {
  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WebContainer>
          <Stack
            screenOptions={{
              headerBackButtonDisplayMode: "minimal",
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="[topic]/[year]/index"
              options={({ route }) => {
                const params = route.params as Params;
                const label = getTopic(params?.topic as TOPIC_KEY).label;
                return {
                  title: `${label} of ${params?.year}`,
                };
              }}
            />
            <Stack.Screen
              name="[topic]/[year]/[session]/index"
              options={({ route }) => {
                const params = route.params as Params;
                const label = getTopic(params?.topic as TOPIC_KEY).label;
                return {
                  title: `Lobby ${label} of ${params?.year}`,
                };
              }}
            />
          </Stack>
        </WebContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
