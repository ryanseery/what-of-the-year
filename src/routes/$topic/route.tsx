import { Outlet, createFileRoute } from "@tanstack/react-router";

import { Loading } from "components/states/loading";
import { useAnonymousAuth } from "hooks/use-anonymous-auth";

export const Route = createFileRoute("/$topic")({
  component: TopicLayout,
});

function TopicLayout() {
  const { isAuthenticated } = useAnonymousAuth();

  const { topic } = Route.useParams();

  if (!isAuthenticated) return <Loading />;

  return (
    <div className="flex flex-1 flex-col" data-topic={topic}>
      <Outlet />
    </div>
  );
}
