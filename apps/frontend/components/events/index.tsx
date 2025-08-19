'use client'

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "@/app/lib/events"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Pagination from "./pagination"

export default function Events() {
  // TODO: handle loading and error states
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents()
  })

  dayjs.extend(utc)
  const format = (dateTime: string) => dayjs(dateTime).utc().format('MMM D, YYYY h:mm A')

  return (
    <section className="p-8 space-y-12">
      {data?._embedded.events.length && (
        <ul className="grid lg:grid-cols-4 gap-12">{data._embedded.events.map((event) => (
          <li className="flex flex-col gap-y-4 justify-between" key={event.id}>
            <a className="group" href={event.url} target="_blank">
              <h2 className="font-bold group-hover:underline">{event.name}</h2>
              <p className="text-sm mt-1">{event._embedded.venues[0].name}</p>
              <p className="text-xs mt-1">{format(event.dates.start.dateTime)}</p>
            </a>

            <div className="aspect-video w-full">
              <img className="object-fill size-full rounded-md" src={event.images.find(({ ratio, width }) => ratio === "16_9" && width > 1000)?.url} alt={event.name} />
            </div>
          </li>
        ))}
        </ul>
      )}

      {data?.page && (
        <footer className="border-t pt-4">
          <Pagination pagination={data.page} />
        </footer>
      )}
    </section>
  )
}

