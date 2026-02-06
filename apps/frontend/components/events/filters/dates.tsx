"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ChevronsUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/translate";

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

const initialSelection = fastFilterOptions[0];

export default function FilterDates() {
  dayjs.extend(utc);

  const router = useRouter();

  const searchParams = useSearchParams();

  // TODO: Find a way to reuse this
  const format = (dateTime: Date) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

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
    }) || initialSelection;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="w-fit flex gap-x-2 items-center py-1 px-3 border bg-input/50 font-semibold rounded text-sm">
            {selectedOption.label}
            <ChevronsUpDownIcon size={14} />
          </button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="rounded w-60">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={selectedOption.value}>
            {fastFilterOptions.map((option) => (
              <DropdownMenuRadioItem
                className={
                  option === selectedOption
                    ? "text-blue-300 data-disabled:opacity-100"
                    : ""
                }
                disabled={option === selectedOption}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", "0");
                  params.set("startDateTime", format(option.dates[0]));
                  params.set("endDateTime", format(option.dates[1]));
                  params.sort();
                  router.push(`/search?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                value={option.value}
                key={option.value}
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
