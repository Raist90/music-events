import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "@/lib/events/getEvents";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";
import Navigation from "@/components/navigation";
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
        {...(typeof params.country === "string" && { country: params.country })}
      />

      <Suspense fallback={<EventsSkeleton />}>
        <Events />
      </Suspense>
    </HydrationBoundary>
  );
}
