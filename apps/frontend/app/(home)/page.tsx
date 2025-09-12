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
import { Genre } from "@/lib/events/genres";

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
    genreId: Genre.Pop,
  };

  const rockQuery = {
    ...basicQuery,
    genreId: Genre.Rock,
  };

  const sections = [
    { title: "Prossimi eventi", query: nextMonthQuery },
    { title: "Eventi Pop", query: popQuery },
    { title: "Eventi Rock", query: rockQuery },
  ] satisfies Record<string, string | Record<string, string>>[];

  const queryClient = new QueryClient();
  await Promise.all(
    sections.map(({ query }) =>
      queryClient.prefetchQuery({
        queryKey: ["events", query],
        queryFn: () => getEvents(query),
      }),
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Banner title="Trova il tuo prossimo evento" />

      <div className="space-y-12 my-12">
        {sections.map(({ title, query }) => (
          <section key={title} className="space-y-4">
            <h3 className="font-title font-semibold px-8 uppercase">{title}</h3>
            <Suspense fallback={<EventsSkeleton />}>
              <Events paginated={false} params={query} />
            </Suspense>
          </section>
        ))}
      </div>
    </HydrationBoundary>
  );
}
