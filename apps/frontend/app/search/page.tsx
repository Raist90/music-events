import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "../lib/events";
import Filters from "@/components/events/filters";
import CountryFilter from "@/components/events/filters/country";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";
import CitiesFilter from "@/components/events/filters/cities";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Plus } from "lucide-react";

export default async function Search({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const queryClient = new QueryClient()

  const page = (await searchParams).page
  const country = (await searchParams).country
  const city = (await searchParams).city
  const attractionId = (await searchParams).attractionId
  const params = {
    ...(Array.isArray(city) ? { city } : {}),
    ...(typeof country === 'string' ? { country } : {}),
    ...(typeof page === 'string' ? { page } : { page: '0' }),
    ...(typeof attractionId === 'string' ? { attractionId } : {}),
  }
  await queryClient.prefetchQuery({
    queryKey: ['events',
      {
        city: city || [],
        country: country || null,
        page: page || "0",
        attractionId: attractionId || null,
      }
    ],
    queryFn: () => getEvents(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex gap-x-2 items-center px-8 py-4 text-sm sticky top-0 bg-background/85 backdrop-blur-md border-b border-input">
        <Drawer>
          <DrawerTrigger className="ml-auto" asChild>
            <button className="font-semibold flex gap-x-1 items-center cursor-pointer">
              Filtri
              <Plus className="size-4" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="!rounded-none">
            <DrawerHeader>
              <DrawerTitle>Filtri</DrawerTitle>
              <DrawerDescription>Seleziona i filtri per la ricerca</DrawerDescription>
            </DrawerHeader>
            <Filters>
              <CountryFilter initialValue={params.country} />
              <CitiesFilter />
            </Filters>
          </DrawerContent>
        </Drawer>
      </div>

      <Suspense fallback={<EventsSkeleton />}>
        <Events />
      </Suspense>
    </HydrationBoundary>
  );
}
