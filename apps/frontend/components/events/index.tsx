"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import { tv } from "tailwind-variants";
import List from "../list";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import Pagination from "./pagination";
import EventsSkeleton from "./skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { getReadonlyParams } from "@/lib/events/searchParams";

type Props = {
  className?: string;
  cols?: 3 | 4 | 5 | 6;
  paginated?: boolean;
  params?: Record<string, string | string[] | null>;
  showCarousel?: boolean;
  variant?: "landscape" | "portrait" | "square";
};

const eventsTv = tv({
  base: "grid gap-8",
  variants: {
    cols: {
      3: "md:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "md:grid-cols-3 lg:grid-cols-6",
    },
    variant: {
      landscape: "",
      portrait: "lg:w-2/3 md:mx-auto",
      square: "",
    },
  },
  defaultVariants: {
    cols: 4,
    variant: "landscape",
  },
});

export default function Events({
  cols = 4,
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
              : eventsTv({ cols, variant })
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
