import { Redirect, Stack } from "expo-router";
import { Lobby } from "screens/lobby";

import { useParams } from "hooks/use-params";

export default function LobbyIndex() {
  const { topic, year, session } = useParams();

  if (!topic || !year || !session) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Lobby ${topic.label} of ${year}`,
        }}
      />
      <Lobby topic={topic} year={year} sessionId={session} />
    </>
  );
}
