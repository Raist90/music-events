"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import List from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import Pagination from "./pagination";
import SearchBoard from "./searchBoard";
import EventsSkeleton from "./skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { getReadonlyParams } from "@/lib/events/searchParams";
import { Ticketmaster } from "@/lib/types";

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

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["events", query],
    queryFn: () => getEvents(query),
  });
  if (isFetching) return <EventsSkeleton />;
  if (!data) notFound();

  return (
    <section className="space-y-12">
      <EventList
        className={className}
        data={data}
        variant={variant}
        showCarousel={showCarousel}
        showSearchBoard={showSearchBoard}
      />

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
  data: searchResult,
  variant = "landscape",
  showCarousel,
  showSearchBoard,
}: Props & Readonly<{ data: Ticketmaster }>) {
  const { events } = searchResult._embedded;

  let EventList = (
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

  if (showSearchBoard) {
    EventList = (
      <SearchBoard searchResult={searchResult}>{EventList}</SearchBoard>
    );
  }

  return EventList;
}
