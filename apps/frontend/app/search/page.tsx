import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
import Events from "@/components/events";
import EventsList from "@/components/events/list";
import EventsPagination from "@/components/events/pagination";
import EventsSearchBoard from "@/components/events/searchBoard";
import EventsSkeleton from "@/components/events/skeleton";
import Navigation from "@/components/navigation";
import { getEvents } from "@/lib/events/getEvents";
import { getParams } from "@/lib/events/searchParams";

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
      <Navigation
        {...(typeof params.countryCode === "string" && {
          countryCode: params.countryCode,
        })}
      />

      <Suspense fallback={<EventsSkeleton />}>
        <Events className="space-y-12">
          <EventsSearchBoard>
            <EventsList variant="square" />
          </EventsSearchBoard>

          {/* DIVIDER */}
          <div className="mb-12" />

          <EventsPagination />
        </Events>
      </Suspense>
    </HydrationBoundary>
  );
}
