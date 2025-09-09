"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { it } from "react-day-picker/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";

export default function DatesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  dayjs.extend(utc);

  const _start = searchParams.get("startDateTime");
  const _end = searchParams.get("endDateTime");
  const [start, setStart] = React.useState<Date | undefined>(
    _start ? dayjs(_start).toDate() : undefined,
  );
  const [end, setEnd] = React.useState<Date | undefined>(
    _end ? dayjs(_end).toDate() : undefined,
  );

  // TODO: Find a way to reuse this
  const format = (dateTime: Date) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

  const onSelectStart = (start: Date) => {
    setStart(start);
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    params.set("startDateTime", format(start));
    router.prefetch(`/search?${params.toString()}`);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const onSelectEnd = (end: Date) => {
    setEnd(end);
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    params.set("endDateTime", format(end));
    router.prefetch(`/search?${params.toString()}`);
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex gap-x-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-40 font-normal rounded-none"
          >
            {start ? `${start.toLocaleDateString()}` : "A partire da"}
            <ChevronDownIcon />
          </Button>
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
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-40 font-normal rounded-none"
          >
            {end ? `${end.toLocaleDateString()}` : "Fino a"}
            <ChevronDownIcon />
          </Button>
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
            startMonth={start || new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
