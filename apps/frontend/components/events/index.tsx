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
    <section className="space-y-12">
      <div className="px-8">
        {data?._embedded?.events.length && (
          <ul className="grid lg:grid-cols-4 gap-12">{data._embedded.events.map((event) => (
            <li className="flex flex-col gap-y-4" key={event.id}>
              <div className="aspect-video w-full">
                <img className="object-fill size-full rounded-md" src={event.images.find(({ ratio, width }) => ratio === "16_9" && width > 1000)?.url} alt={event.name} />
              </div>

              <div className="flex flex-col">
                <a className="group" href={event.url} target="_blank">
                  <h2 className="font-bold group-hover:underline">{event.name}</h2>
                </a>

                <p className="text-xs mt-1">{format(event.dates.start.dateTime)}</p>
                <p className="text-sm mt-1">{event._embedded.venues[0].city.name}, {event._embedded.venues[0].name}</p>

                {event._embedded?.attractions?.length && (
                  <div className="flex justify-between mt-2 pt-2 border-t">
                    {event._embedded?.attractions?.length && (
                      <div className="text-xs">
                        <p>Feat</p>

                        {event._embedded.attractions.filter((_, index) => index < 2).map(({ id, name }) => (
                          <p className="uppercase font-semibold" key={id}>{name}</p>
                        ))}

                        {event._embedded.attractions.length > 2 && (
                          <p>e altri {event._embedded.attractions.length - 2} artisti</p>
                        )}
                      </div>
                    )}

                    {event._embedded.attractions?.[0].classifications[0].genre.name && event._embedded.attractions?.[0].classifications[0].genre.name !== 'Undefined' && (
                      <div>
                        <p className="text-xs">Genere</p>
                        <p className="text-xs uppercase font-semibold">{event._embedded.attractions[0].classifications[0].genre.name}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
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

