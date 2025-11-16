"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import { EventsProvider } from "./eventsContext";
import EventsSkeleton from "./skeleton";
import { getEvents } from "@/lib/events/getEvents";
import { getReadonlyParams } from "@/lib/events/searchParams";

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
  params?: Record<string, string | string[] | null>;
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
