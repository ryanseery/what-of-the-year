import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { WebContainer } from "components/web-container";
import { getTopic, TOPIC_KEY } from "constants/topics";
import { ThemeProvider } from "utils/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WebContainer>
          <Stack
            screenOptions={{ headerBackButtonDisplayMode: "minimal", headerShadowVisible: false }}
          >
            <Stack.Screen options={{ headerShown: false }} name="index" />
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
            <Stack.Screen name="[topic]/[table]/[id]" />
          </Stack>
        </WebContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
