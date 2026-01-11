"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";

const { t } = translate("it");
const fastFilterOptions = [
  {
    label: t("navigation.filters.dates.all_dates"),
    value: "all_dates",
    dates: [dayjs().toDate(), dayjs("2100-01-01").toDate()],
  },
  {
    label: t("navigation.filters.dates.next_week"),
    value: "next_week",
    dates: [dayjs().toDate(), dayjs().add(7, "day").toDate()],
  },
  {
    label: t("navigation.filters.dates.next_month"),
    value: "next_month",
    dates: [dayjs().toDate(), dayjs().add(1, "month").toDate()],
  },
  {
    label: t("navigation.filters.dates.next_three_months"),
    value: "next_3_months",
    dates: [dayjs().toDate(), dayjs().add(3, "month").toDate()],
  },
  {
    label: t("navigation.filters.dates.next_six_months"),
    value: "next_6_months",
    dates: [dayjs().toDate(), dayjs().add(6, "month").toDate()],
  },
  {
    label: t("navigation.filters.dates.next_year"),
    value: "next_year",
    dates: [dayjs().toDate(), dayjs().add(1, "year").toDate()],
  },
];

export default function DatesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  dayjs.extend(utc);

  // TODO: Find a way to reuse this
  const format = (dateTime: Date) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

  const fallbackOption = fastFilterOptions[0];
  const selectedOption =
    fastFilterOptions.find((option) => {
      const start = searchParams.get("startDateTime");
      const end = searchParams.get("endDateTime");

      if (!start || !end) {
        return false;
      }

      return (
        dayjs(option.dates[0]).isSame(start, "day") &&
        dayjs(option.dates[1]).isSame(end, "day")
      );
    }) || fallbackOption;

  return (
    <div className="flex gap-2 text-sm overflow-auto relative px-4 -mx-4 mask-fade-x-4 [scrollbar-width:none]">
      {fastFilterOptions.map((option) => (
        <button
          className={cn(
            option.dates === selectedOption.dates && "text-blue-300",
            "bg-input/50 font-semibold rounded border border-input py-1 px-2 flex items-center shrink-0",
          )}
          key={option.value}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("page", "0");
            params.set("startDateTime", format(option.dates[0]));
            params.set("endDateTime", format(option.dates[1]));
            router.push(`/search?${params.toString()}`, { scroll: false });
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
