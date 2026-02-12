import { onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

import { playersRef } from "db/collections";
import type { Player } from "db/types";

interface PlayerWithId extends Player {
  uid: string;
}

export function usePlayers(sessionId: string | undefined) {
  const [players, setPlayers] = useState<PlayerWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const q = query(playersRef(sessionId), orderBy("joinedAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updated = snapshot.docs.map((doc) => ({
          uid: doc.id,
          ...(doc.data() as Player),
        }));
        setPlayers(updated);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [sessionId]);

  return { players, isLoading, error };
}
