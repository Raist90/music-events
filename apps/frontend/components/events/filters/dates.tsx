"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ChevronDownIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
  const start = startParam ? dayjs(startParam).toDate() : undefined;
  const end = endParam ? dayjs(endParam).toDate() : undefined;

  // TODO: Find a way to reuse this
  const format = (dateTime: Date) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

  function onSelectStart(start: Date) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    params.set("startDateTime", format(start));
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

  function onSelectEnd(end: Date) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");
    params.set("endDateTime", format(end));
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

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
