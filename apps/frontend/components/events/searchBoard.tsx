"use client";

import { useSearchParams } from "next/navigation";
import Board from "../board";
import BoardHeader from "../board/header";
import { useEvents } from "./eventsContext";
import FilterCities from "./filters/cities";
import FilterCountry from "./filters/country";
import FilterDates from "./filters/dates";
import { CountryEnum } from "@/lib/events/countries";
import { getReadonlyParams } from "@/lib/events/searchParams";
import { translate } from "@/lib/translate";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function EventsSearchBoard({ children }: Props) {
  const { data } = useEvents();

  const searchParams = useSearchParams();
  const query = getReadonlyParams(searchParams);

  function getSearchSummary(): string {
    const summaryItems: string[] = [];

    if (
      typeof query.keyword === "string" &&
      // cities are valid keywords too
      ((Array.isArray(query.city) && !query.city?.includes(query.keyword)) ||
        (typeof query.city === "string" && query.keyword !== query.city))
    )
      summaryItems.push(`${t("search.board.for")} ${query.keyword}`);

    if (Array.isArray(query?.city) && query.city.length > 0)
      summaryItems.push(
        `${t("search.board.in")} ${[...query.city.map(capitalize)].join(", ")}`,
      );

    if (
      typeof query.countryCode === "string" &&
      query.countryCode in CountryEnum
    ) {
      summaryItems.push(
        `(${CountryEnum[query.countryCode as keyof typeof CountryEnum]})`,
      );
    } else {
      summaryItems.push(`(${CountryEnum.IT})`);
    }

    return summaryItems.filter(Boolean).join(" ");
  }

  const { t } = translate("it");

  return (
    <Board variant="featured">
      <BoardHeader
        {...(data?.page && data.page.totalElements > 0
          ? {
              description: t("search.board.description", {
                query: getSearchSummary(),
              }),
            }
          : { description: t("search.board.no_results") })}
        title={t("search.board.title")}
      >
        <div className="flex gap-x-4 overflow-auto mask-fade-x-4 px-4 -ml-4 lg:-mx-4 [scrollbar-width:none]">
          <div className="shrink-0">
            <FilterCountry />
          </div>

          <div className="shrink-0">
            <FilterCities />
          </div>

          <div className="shrink-0">
            <FilterDates />
          </div>
        </div>
      </BoardHeader>
      {children}
    </Board>
  );
}
