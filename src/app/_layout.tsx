import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="[topic]"
            options={({ route }) => {
              const params = route.params as { topic?: string } | undefined;
              const label = getTopic(params?.topic as TOPIC_KEY).label;
              return {
                headerShown: true,
                title: `${label} of the Year`,
                headerBackButtonDisplayMode: "minimal",
                headerShadowVisible: false,
              };
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
