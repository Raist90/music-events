import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "@/events/getEvents";
import Banner from "@/components/banner";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";
import dayjs from 'dayjs'

export default async function Home() {
  // TODO: Find a way to reuse this
  const format = (dateTime: ReturnType<typeof dayjs>) => dayjs(dateTime).format('YYYY-MM-DDTHH:mm:ss[Z]')
  const query = {
    startDateTime: format(dayjs().add(1, 'month')),
    size: '4',
  }

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['events', query],
    queryFn: () => getEvents(query),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="-mt-14">
        <Banner title="Trova il tuo prossimo evento" />
      </main>

      <div className="space-y-12 my-12">
        <section className="space-y-4">
          <h3 className="font-title font-semibold px-8 uppercase">Prossimi eventi</h3>
          <Suspense fallback={<EventsSkeleton />}>
            <Events paginated={false} params={query} />
          </Suspense>
        </section>
      </div>
    </HydrationBoundary>
  );
}
