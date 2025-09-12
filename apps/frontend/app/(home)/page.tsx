import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "@/lib/events/getEvents";
import Banner from "@/components/banner";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";
import dayjs from "dayjs";
import { genresMap } from "@/lib/events/genres";

export default async function Home() {
  // TODO: Find a way to reuse this
  const format = (dateTime: ReturnType<typeof dayjs>) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");
  const basicQuery = {
    size: "4",
  };

  const nextMonthQuery = {
    ...basicQuery,
    startDateTime: format(dayjs().add(1, "month")),
  };

  const popQuery = {
    ...basicQuery,
    genreId: genresMap.Pop,
  };

  const rockQuery = {
    ...basicQuery,
    genreId: genresMap.Rock,
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["events", nextMonthQuery],
    queryFn: () => getEvents(nextMonthQuery),
  });

  await queryClient.prefetchQuery({
    queryKey: ["events", rockQuery],
    queryFn: () => getEvents(rockQuery),
  });

  await queryClient.prefetchQuery({
    queryKey: ["events", rockQuery],
    queryFn: () => getEvents(rockQuery),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Banner title="Trova il tuo prossimo evento" />

      <div className="space-y-12 my-12">
        <section className="space-y-4">
          <h3 className="font-title font-semibold px-8 uppercase">
            Prossimi eventi
          </h3>
          <Suspense fallback={<EventsSkeleton />}>
            <Events paginated={false} params={nextMonthQuery} />
          </Suspense>
        </section>

        <section className="space-y-4">
          <h3 className="font-title font-semibold px-8 uppercase">
            Eventi Pop
          </h3>
          <Suspense fallback={<EventsSkeleton />}>
            <Events paginated={false} params={popQuery} />
          </Suspense>
        </section>

        <section className="space-y-4">
          <h3 className="font-title font-semibold px-8 uppercase">
            Eventi Rock
          </h3>
          <Suspense fallback={<EventsSkeleton />}>
            <Events paginated={false} params={rockQuery} />
          </Suspense>
        </section>
      </div>
    </HydrationBoundary>
  );
}
