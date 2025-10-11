"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import List from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import Pagination from "./pagination";
import EventsSkeleton from "./skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { getReadonlyParams } from "@/lib/events/searchParams";

type Props = Readonly<{
  className?: string;
  paginated?: boolean;
  params?: Record<string, string | string[] | null>;
  showCarousel?: boolean;
  variant?: "landscape" | "portrait" | "square";
}>;

export default function Events({
  paginated = true,
  params,
  variant = "landscape",
  showCarousel = false,
}: Props) {
  const searchParams = useSearchParams();
  const query = params || getReadonlyParams(searchParams);

  // TODO: Handle loading and error states
  const { data, isFetching } = useQuery({
    queryKey: ["events", query],
    queryFn: () => getEvents(query),
  });

  // TODO: Add variants to skeletons
  if (isFetching) return <EventsSkeleton />;

  const events = data?._embedded?.events ?? [];
  if (!events.length) notFound();

  return (
    <section className="space-y-12">
      <div className="px-8">
        <List
          className={
            showCarousel
              ? "md:basis-1/3 lg:basis-1/4"
              : "md:grid-cols-3 lg:grid-cols-6"
          }
          items={events}
          renderItem={(event) => (
            <EventProvider event={event} variant={variant}>
              <EventCard />
            </EventProvider>
          )}
          {...(showCarousel && { showCarousel: true })}
        />
      </div>

      {data?.page && paginated && (
        <footer className="border-t p-4">
          <Pagination pagination={data.page} />
        </footer>
      )}
    </section>
  );
}
