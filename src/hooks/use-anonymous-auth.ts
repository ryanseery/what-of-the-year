import { useAuthActions } from "@convex-dev/auth/react";
import * as Sentry from "@sentry/react";
import { useEffect, useRef, useState } from "react";

import { useConvexAuth } from "convex/react";
import { tryCatch } from "utils/try-catch";

/**
 * Signs the visitor in anonymously when no session exists.
 *
 * `signIn("anonymous")` mints a new user on every call, and a second token
 * replaces the first — so the effect must never start a second sign-in while
 * one is in flight. StrictMode's simulated remount re-runs the effect on the
 * same instance, so a ref is enough to catch it. Callers gate rendering on
 * `isAuthenticated`, which is what keeps every write behind the settled
 * identity.
 */
export function useAnonymousAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const inFlight = useRef(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isAuthenticated || isLoading || error || inFlight.current) return;

    inFlight.current = true;
    const authenticate = async () => {
      const { error } = await tryCatch(signIn("anonymous"));
      inFlight.current = false;
      if (error) {
        Sentry.captureException(error);
        setError(error);
      }
    };

    void authenticate();
  }, [isAuthenticated, isLoading, error]);

  return { isAuthenticated, error };
}
