'use client'

import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../lib/events"

export default function Events() {
  // TODO: handle loading and error states
  const { data } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents()
  })

  return (
    <div>
      <ul className="grid grid-cols-3">{data?._embedded.events.map((event) => (
        <li key={event.id}>
          <h2>{event.name}</h2>
          <p>{event.dates.start.localTime}</p>
        </li>
      ))}
      </ul>
    </div>
  )
}

