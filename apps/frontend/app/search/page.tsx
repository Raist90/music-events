import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import Events from "@/features/events/components/index";
import EventsList from "@/features/events/components/list";
import EventsPagination from "@/features/events/components/pagination";
import EventsSearchBoard from "@/features/events/components/searchBoard";
import EventsSkeleton from "@/features/events/components/skeleton";
import { getEvents } from "@/features/events/getEvents";
import { getParams } from "@/features/events/searchParams";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = getParams(await searchParams);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["events", params],
    queryFn: () => getEvents(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<EventsSkeleton />}>
        <Events className="space-y-12 mt-20 lg:mt-8">
          <EventsSearchBoard>
            <EventsList />
          </EventsSearchBoard>

          {/* DIVIDER */}
          <div className="mb-12" />

          <EventsPagination />
        </Events>
      </Suspense>
    </HydrationBoundary>
  );
}
