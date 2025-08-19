import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "../lib/events";


export default async function Search({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryClient = new QueryClient()

  const page = (await searchParams).page
  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(typeof page === 'string' ? { page } : {})
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Events />
    </HydrationBoundary>
  );
}
