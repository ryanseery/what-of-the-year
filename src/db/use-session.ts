import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import { sessionRef } from "db/collections";
import type { Session } from "db/types";

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = onSnapshot(
      sessionRef(sessionId),
      (snapshot) => {
        if (snapshot.exists()) {
          setSession(snapshot.data() as Session);
        } else {
          setError(new Error("Session not found"));
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [sessionId]);

  return { session, isLoading, error };
}
