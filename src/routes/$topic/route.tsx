import { Outlet, createFileRoute } from "@tanstack/react-router";

import { DisplayError } from "components/states/error";
import { Loading } from "components/states/loading";
import { useAnonymousAuth } from "hooks/use-anonymous-auth";
import { getApiError } from "utils/api-error";

export const Route = createFileRoute("/$topic")({
  component: TopicLayout,
});

function TopicLayout() {
  const { isAuthenticated, error } = useAnonymousAuth();

  const { topic } = Route.useParams();

  // A failed sign-in has nothing to re-trigger it; a reload starts over.
  if (error) {
    return (
      <DisplayError message={getApiError(error).message} onRetry={() => window.location.reload()} />
    );
  }
  if (!isAuthenticated) return <Loading />;

  return (
    <div className="flex flex-1 flex-col" data-topic={topic}>
      <Outlet />
    </div>
  );
}
