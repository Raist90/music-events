import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "../lib/events";
import Filters from "@/components/events/filters";
import CityFilter from "@/components/events/filters/city";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";

export default async function Search({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryClient = new QueryClient()

  const page = (await searchParams).page
  const city = (await searchParams).city
  const params = {
    ...(typeof city === 'string' ? { city } : {}),
    ...(typeof page === 'string' ? { page } : { page: '0' })
  }
  await queryClient.prefetchQuery({
    queryKey: ['events', params.city || '', params.page],
    queryFn: () => getEvents(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Filters>
        <CityFilter initialValue={params.city} />
      </Filters>

      <Suspense fallback={<EventsSkeleton />}>
        <Events />
      </Suspense>
    </HydrationBoundary>
  );
}
