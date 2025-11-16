"use client";

import { CarouselList } from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import { useEvents } from "./eventsContext";

type Props = Readonly<{
  className?: string;
  variant?: "landscape" | "portrait" | "square";
}>;

export default function EventsCarouselList({
  className,
  variant = "landscape",
}: Props) {
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
