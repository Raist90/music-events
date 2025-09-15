"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/events/getEvents";
import Pagination from "./pagination";
import EventCard from "./eventCard";
import { useSearchParams } from "next/navigation";
import EventsSkeleton from "./skeleton";
import { getReadonlyParams } from "@/lib/events/searchParams";
import { cva } from "class-variance-authority";

type Props = {
  className?: string;
  cols?: number;
  paginated?: boolean;
  params?: Record<string, string | string[] | null>;
  variant?: "landscape" | "portrait" | "square";
};

const layoutVariants = cva("grid gap-12", {
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
            className={layoutVariants({
              cols: String(cols) as keyof typeof layoutVariants,
              variant,
            })}
          >
            {data._embedded.events.map((event) => (
              <div key={event.id}>
                <EventCard event={event} variant={variant} />
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
