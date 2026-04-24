"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useSearchParams } from "next/navigation";
import { getEvents } from "../getEvents";
import { getReadonlyParams } from "../searchParams";
import { EventsProvider } from "./eventsContext";
import EventsSkeleton from "./skeleton";

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
  // TODO: We should return a 500 here
  if (!data) notFound();

  return (
    <EventsProvider data={data}>
      <div className={className}>{children}</div>
    </EventsProvider>
  );
}
