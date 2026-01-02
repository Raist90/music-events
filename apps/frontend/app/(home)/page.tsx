import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import Banner from "@/components/banner";
import Board from "@/components/board";
import Events from "@/components/events";
import EventsList from "@/components/events/list";
import EventsSkeleton from "@/components/events/skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { translate } from "@/lib/translate";

export default async function Home() {
  const params = {
    size: "20",
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["events", params],
    queryFn: () => getEvents(params),
  });

  const { t } = translate("it");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="m-4 md:m-8">
        <Banner />
      </section>

      <div className="space-y-12 my-12">
        <Board
          description={t("home.board.description")}
          title={t("home.board.title")}
          variant={"featured"}
        >
          <Suspense fallback={<EventsSkeleton />}>
            <Events params={params}>
              <EventsList className="md:grid-cols-4 lg:grid-cols-5" />
            </Events>
          </Suspense>
        </Board>
      </div>
    </HydrationBoundary>
  );
}
