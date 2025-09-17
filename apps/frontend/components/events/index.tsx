"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { tv } from "tailwind-variants";
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
  variant?: "landscape" | "portrait" | "square";
};

const events = tv({
  base: "grid gap-12",
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
}: Props) {
  const searchParams = useSearchParams();
  const query = params || getReadonlyParams(searchParams);

  // TODO: handle loading and error states
  const { data, isFetching } = useQuery({
    queryKey: ["events", query],
    queryFn: () => getEvents(query),
  });

  if (isFetching) return <EventsSkeleton />;

  return (
    <section className="space-y-12">
      <div className="px-8">
        {data?._embedded?.events.length && (
          <ul
            className={events({
              cols,
              variant,
            })}
          >
            {data._embedded.events.map((event) => (
              <div key={event.id}>
                <EventProvider event={event} variant={variant}>
                  <EventCard />
                </EventProvider>
              </div>
            ))}
          </ul>
        )}
      </div>

      {data?.page && paginated && (
        <footer className="border-t p-4">
          <Pagination pagination={data.page} />
        </footer>
      )}
    </section>
  );
}
