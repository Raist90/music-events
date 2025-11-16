"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import List, { CarouselList } from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import { EventsProvider, useEvents } from "./eventsContext";
import Pagination from "./pagination";
import EventsSkeleton from "./skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { getReadonlyParams } from "@/lib/events/searchParams";

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
  params?: Record<string, string | string[] | null>;
  variant?: "landscape" | "portrait" | "square";
}>;

export default function Events({ children, className, params }: Props) {
  const searchParams = useSearchParams();
  const query = params || getReadonlyParams(searchParams);
  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["events", query],
    queryFn: () => getEvents(query),
  });

  if (isFetching) return <EventsSkeleton />;
  if (!data) notFound();

  return (
    <EventsProvider data={data}>
      <div className={className}>{children}</div>
    </EventsProvider>
  );
}

export function EventsList({
  className,
  variant = "landscape",
}: Pick<Props, "className" | "variant">) {
  const { data } = useEvents();
  return (
    <section>
      <div className="px-8">
        <List
          className={className}
          items={data._embedded.events}
          renderItem={(event) => (
            <EventProvider event={event} variant={variant}>
              <EventCard />
            </EventProvider>
          )}
        />
      </div>
    </section>
  );
}

export function EventsCarouselList({
  className,
  variant = "landscape",
}: Pick<Props, "className" | "variant">) {
  const {
    data: {
      _embedded: { events },
    },
  } = useEvents();
  return (
    <section>
      <div className="px-8">
        <CarouselList
          items={events}
          renderItem={(event) => (
            <EventProvider event={event} variant={variant ?? "landscape"}>
              <EventCard />
            </EventProvider>
          )}
          className={className ?? "md:basis-1/3 lg:basis-1/4"}
        />
      </div>
    </section>
  );
}

export function EventsPagination() {
  const { data } = useEvents();
  return (
    <footer className="border-t p-4">
      <Pagination pagination={data.page} />
    </footer>
  );
}
