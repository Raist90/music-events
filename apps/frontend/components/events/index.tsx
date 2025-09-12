"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/events/getEvents";
import Pagination from "./pagination";
import EventCard from "./eventCard";
import { useSearchParams } from "next/navigation";
import EventsSkeleton from "./skeleton";
import { getReadonlyParams } from "@/lib/events/searchParams";

type Props = {
  paginated?: boolean;
  params?: Record<string, string | string[] | null>;
};

export default function Events({ paginated = true, params }: Props) {
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
          <ul className="grid lg:grid-cols-4 gap-12">
            {data._embedded.events.map((event) => (
              <div key={event.id}>
                <EventCard event={event} />
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
