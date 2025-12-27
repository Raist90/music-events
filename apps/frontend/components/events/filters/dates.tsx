"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ChevronDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { it } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function DatesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  dayjs.extend(utc);

  const startParam = searchParams.get("startDateTime");
  const endParam = searchParams.get("endDateTime");
  const start = startParam ? dayjs(startParam).toDate() : dayjs().toDate();
  const end = endParam
    ? dayjs(endParam).toDate()
    : dayjs().add(6, "month").toDate();

  // TODO: Find a way to reuse this
  const format = (dateTime: Date) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

  // TODO: Refactor this with nuqs
  function onSelectStart(start: Date) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    params.set("startDateTime", format(start));
    params.set("endDateTime", format(dayjs(start).add(6, "months").toDate()));
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

  // TODO: Refactor this with nuqs
  function onSelectEnd(end: Date) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    params.set("endDateTime", format(end));
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-y-2">
            <span className="text-xs font-bold uppercase">A partire da</span>

            <Button
              variant="outline"
              id="dates"
              className="w-full flex justify-between md:w-40 font-normal rounded-none"
            >
              {start
                ? `${start.toLocaleDateString()}`
                : dayjs().toDate().toLocaleDateString()}
              <ChevronDownIcon className="opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 rounded-none"
          align="start"
        >
          <Calendar
            mode="single"
            disabled={{ before: new Date() }}
            selected={start}
            captionLayout="dropdown"
            locale={it}
            onSelect={(date) => date && onSelectStart(date)}
            startMonth={new Date()}
            endMonth={dayjs().add(6, "month").toDate()}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-y-2">
            <span className="text-xs font-bold uppercase">Fino a</span>

            <Button
              variant="outline"
              id="dates"
              className="w-full flex justify-between md:w-40 font-normal rounded-none"
            >
              {end
                ? `${end.toLocaleDateString()}`
                : dayjs().add(6, "month").toDate().toLocaleDateString()}
              <ChevronDownIcon className="opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 rounded-none"
          align="start"
        >
          <Calendar
            mode="single"
            disabled={{ before: start || new Date() }}
            selected={end}
            captionLayout="dropdown"
            locale={it}
            onSelect={(date) => date && onSelectEnd(date)}
            startMonth={end}
            endMonth={dayjs().add(1, "year").toDate()}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
