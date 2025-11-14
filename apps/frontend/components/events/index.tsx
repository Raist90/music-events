"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import List from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import Pagination from "./pagination";
import SearchBoard from "./searchBoard";
import EventsSkeleton from "./skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { getReadonlyParams } from "@/lib/events/searchParams";
import { Event } from "@/lib/types";

type Props = Readonly<{
  className?: string;
  paginated?: boolean;
  params?: Record<string, string | string[] | null>;
  showCarousel?: boolean;
  showSearchBoard?: boolean;
  variant?: "landscape" | "portrait" | "square";
}>;

export default function Events({
  className,
  paginated = true,
  params,
  showCarousel = false,
  showSearchBoard = false,
  variant = "landscape",
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
  if (!data || !events.length) notFound();

  return (
    <section className="space-y-12">
      {showSearchBoard ? (
        <SearchBoard results={data}>
          <EventList
            className={className}
            events={events}
            showCarousel={showCarousel}
            variant={variant}
          />
        </SearchBoard>
      ) : (
        <EventList
          className={className}
          events={events}
          showCarousel={showCarousel}
          variant={variant}
        />
      )}

      {data?.page && paginated && (
        <footer className="border-t p-4">
          <Pagination pagination={data.page} />
        </footer>
      )}
    </section>
  );
}

function EventList({
  className,
  events,
  variant = "landscape",
  showCarousel = false,
}: Props & Readonly<{ events: Event[] }>) {
  return (
    <div className="px-8">
      <List
        className={showCarousel ? "md:basis-1/3 lg:basis-1/4" : className}
        items={events}
        renderItem={(event) => (
          <EventProvider event={event} variant={variant}>
            <EventCard />
          </EventProvider>
        )}
        {...(showCarousel && { showCarousel: true })}
      />
    </div>
  );
}
