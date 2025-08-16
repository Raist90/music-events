import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "./components/events";

type Event = {
  classifications: Classification[];
  dates: Dates;
  id: string;
  name: string;
}

type Classification = {
  id: string;
  name: string;
}

type Dates = {
  start: {
    dateTBA: boolean;
    dateTBD: boolean;
    dateTime: string;
    localDate: string;
    localTime: string;
    noSpecificTime: boolean;
    timeTBA: boolean;
  }
}

type Ticketmaster = {
  _embedded: {
    events: Event[];
  }
}

export async function getEvents() {
  const res = await fetch("http://localhost:8080/events");
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json() as Promise<Ticketmaster>;
}

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Events />
    </HydrationBoundary>
  );
}
