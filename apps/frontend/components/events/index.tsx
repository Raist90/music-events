'use client'

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "@/app/lib/events"
import Pagination from "./pagination"
import EventCard from "./eventCard"
import { useSearchParams } from "next/navigation"

export default function Events() {
  const searchParams = useSearchParams()
  const city = searchParams.get('city') || "";
  const page = searchParams.get('page') || "0";

  // TODO: handle loading and error states
  const { data } = useQuery({
    queryKey: ['events', city, page],
    queryFn: () => getEvents({ city, page }),
  })

  return (
    <section className="space-y-12">
      <div className="px-8">
        {data?._embedded?.events.length && (
          <ul className="grid lg:grid-cols-4 gap-12">{data._embedded.events.map((event) => (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
          </ul>
        )}
      </div>

      {data?.page && (
        <footer className="border-t p-4">
          <Pagination pagination={data.page} />
        </footer>
      )}
    </section>
  )
}

