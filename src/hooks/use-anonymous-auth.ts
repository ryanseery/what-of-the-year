import { useAuthActions } from "@convex-dev/auth/react";
import * as Sentry from "@sentry/react";
import { useEffect } from "react";

import { useToast } from "components/toast";
import { useConvexAuth } from "convex/react";
import { getApiError } from "utils/api-error";
import { singleFlight } from "utils/single-flight";
import { tryCatch } from "utils/try-catch";

/**
 * Module scope, not a ref: a second `signIn("anonymous")` mints a second user
 * whose token replaces the first, so any row already written under the first
 * identity (the host's `players` row) belongs to a stranger. The guard has to
 * outlive the component — StrictMode double-invokes the effect on mount, and
 * navigating out of the layout and back remounts it while the call is in flight.
 */
const signInOnce = singleFlight();

/** Signs the visitor in anonymously, exactly once per page load. */
export function useAnonymousAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const { show } = useToast();

  useEffect(() => {
    if (isAuthenticated || isLoading) return;

    const authenticate = async () => {
      const { error } = await tryCatch(signInOnce(() => signIn("anonymous")));
      if (error) {
        Sentry.captureException(error);
        show({ variant: "error", message: getApiError(error).message });
        return;
      }
    };

    void authenticate();
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated };
}
