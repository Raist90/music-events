"use client";

import List from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import { useEvents } from "./eventsContext";

type Props = Readonly<{
  className?: string;
  variant?: "landscape" | "portrait" | "square";
}>;

export default function EventsList({
  className,
  variant = "landscape",
}: Props) {
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
