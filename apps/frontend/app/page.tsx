import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "./components/events";
import { getEvents } from "./lib/events";


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
