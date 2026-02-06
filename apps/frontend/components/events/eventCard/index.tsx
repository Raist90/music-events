"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEvent } from "../eventContext";
import EventImage from "./eventImage";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  className?: string;
}>;

export default function EventCard({ className }: Props) {
  const { event } = useEvent();

  dayjs.extend(utc);
  const format = (dateTime: string) =>
    dayjs(dateTime).utc().format("DD.MM.YYYY");

  const { t } = translate("it");

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <EventImage />

      <div className="flex flex-col">
        <div className="space-y-1">
          <p className="text-sm font-bold">
            {format(event.dates.start.dateTime)}
          </p>

          <h2 className="font-bold">{event.name}</h2>

          <p className="text-sm">
            {/* TODO: Sometimes city.name is missing */}
            {event._embedded.venues[0].city.name},{" "}
            {event._embedded.venues[0].name}
          </p>
        </div>

        <a
          href={event.url}
          target="_blank"
          className="w-fit py-1 px-3 mt-3 border bg-input/50 font-semibold rounded text-sm"
        >
          {t("card.buy_tickets")}
        </a>
      </div>
    </div>
  );
}
