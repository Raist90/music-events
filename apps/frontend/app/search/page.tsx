import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "../lib/events";
import Menu from "@/components/events/menu";
import { redirect } from "next/navigation";

const cities: string[] = [
  "Bologna",
  "Catania",
  "Firenze",
  "Genova",
  "Milano",
  "Napoli",
  "Palermo",
  "Roma",
  "Torino",
  "Venezia"
];

export default async function Search({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryClient = new QueryClient()

  const page = (await searchParams).page
  const city = (await searchParams).city
  const params = {
    ...(typeof city === 'string' ? { city } : {}),
    ...(typeof page === 'string' ? { page } : { page: '0' })
  }
  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(params)
  })

  const onSelect = async (val: string) => {
    'use server'
    redirect(`/search?city=${val}&page=0`);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Menu initialValue={params.city} items={cities} onSelect={onSelect} />

      <Events />
    </HydrationBoundary>
  );
}
