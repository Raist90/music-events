import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Event } from "@/lib/events/types";
import EventImage from "./eventImage";

type Props = Readonly<{
  event: Event;
}>;

export default function EventCard({ event }: Props) {
  dayjs.extend(utc);
  const format = (dateTime: string) =>
    dayjs(dateTime).utc().format("MMM D, YYYY h:mm A");

  const searchParams = useSearchParams();
  const city = searchParams.getAll("city");
  const country = searchParams.get("country");

  const cityParam = city.length ? city.map((c) => `city=${c}`).join("") : "";
  const countryParam = country ? `&country=${country}` : "";
  const params = `${cityParam}${countryParam}`;

  return (
    <li className="flex flex-col gap-y-4">
      <EventImage event={event} />

      <div className="flex flex-col">
        <a className="group" href={event.url} target="_blank">
          <h2 className="font-bold group-hover:underline">{event.name}</h2>
        </a>

        <p className="text-xs mt-1">{format(event.dates.start.dateTime)}</p>
        <p className="text-sm mt-1">
          {event._embedded.venues[0].city.name},{" "}
          {event._embedded.venues[0].name}
        </p>

        {event._embedded?.attractions?.length && (
          <div className="flex justify-between mt-2 pt-2 border-t">
            {event._embedded?.attractions?.length && (
              <div className="text-xs">
                <p>Feat</p>

                {event._embedded.attractions
                  .filter((_, index) => index < 2)
                  .map(({ id, name }) => (
                    <Link
                      href={`/search?${params}&attractionId=${id}`}
                      className="uppercase font-semibold hover:text-blue-300 hover:underline block"
                      key={id}
                    >
                      {name}
                    </Link>
                  ))}

                {event._embedded.attractions.length > 2 && (
                  <p>
                    e altri {event._embedded.attractions.length - 2} artisti
                  </p>
                )}
              </div>
            )}

            {event._embedded.attractions?.[0].classifications?.[0].genre
              ?.name &&
              event._embedded.attractions?.[0].classifications[0].genre.name !==
                "Undefined" && (
                <div>
                  <p className="text-xs">Genere</p>
                  <Link
                    href={`/search?${params}&genreId=${event._embedded.attractions[0].classifications[0].genre.id}`}
                    className="text-xs hover:text-blue-300 hover:underline uppercase font-semibold"
                  >
                    {
                      event._embedded.attractions[0].classifications[0].genre
                        .name
                    }
                  </Link>
                </div>
              )}
          </div>
        )}
      </div>
    </li>
  );
}
