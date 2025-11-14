"use client";

import { useSearchParams } from "next/navigation";
import Board from "../board";
import { countriesMap } from "@/lib/events/countries";
import { getReadonlyParams } from "@/lib/events/searchParams";
import { translate } from "@/lib/translate";
import type { Ticketmaster } from "@/lib/types";

type Props = Readonly<{
  children: React.ReactNode;
  results: Ticketmaster;
}>;

export default function SearchBoard({ children, results: data }: Props) {
  const searchParams = useSearchParams();
  const query = getReadonlyParams(searchParams);

  function getSearchSummary(
    query: Record<string, string | string[] | null>,
  ): string {
    const summaryItems = [];
    if (query?.attractionId) {
      summaryItems.push(
        data._embedded.events[0]._embedded?.attractions[0]?.name,
      );
    }
    if (query?.country) {
      summaryItems.push(countriesMap[String(query.country).toUpperCase()]);
    }
    if (query?.genreId) {
      summaryItems.push(
        data._embedded.events[0]?._embedded?.attractions?.[0]
          .classifications?.[0].genre?.name,
      );
    }
    if (Array.isArray(query?.city)) {
      summaryItems.push(...query.city);
    }
    return summaryItems
      .filter((q) => q !== undefined)
      .map((q) => q.toLowerCase())
      .join(summaryItems.length > 1 ? ", " : "");
  }

  const { t } = translate("it");

  return (
    <Board
      {...(data?.page && {
        description: t("search.board.description", {
          count: String(data.page?.totalElements),
          query: getSearchSummary(query),
        }),
      })}
      title={t("search.board.title")}
      variant="featured"
    >
      {children}
    </Board>
  );
}
