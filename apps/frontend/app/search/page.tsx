import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "../lib/events";
import Filters from "@/components/events/filters";
import CountryFilter from "@/components/events/filters/country";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";

export default async function Search({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryClient = new QueryClient()

  const page = (await searchParams).page
  const country = (await searchParams).country
  const params = {
    ...(typeof country === 'string' ? { country } : {}),
    ...(typeof page === 'string' ? { page } : { page: '0' })
  }
  await queryClient.prefetchQuery({
    queryKey: ['events', params.country || '', params.page],
    queryFn: () => getEvents(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Filters>
        <CountryFilter initialValue={params.country} />
      </Filters>

      <Suspense fallback={<EventsSkeleton />}>
        <Events />
      </Suspense>
    </HydrationBoundary>
  );
}
