import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import Events from "@/components/events";
import { getEvents } from "@/lib/events/getEvents";
import Banner from "@/components/banner";
import { Suspense } from "react";
import EventsSkeleton from "@/components/events/skeleton";
import dayjs from "dayjs";
import { Genre } from "@/lib/events/genres";
import { translate } from "@/lib/translate";
import Board from "@/components/board";

export default async function Home() {
  // TODO: Find a way to reuse this
  const format = (dateTime: ReturnType<typeof dayjs>) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");
  const basicQuery = {
    size: "6",
    country: "US",
  };

  const nextMonthQuery = {
    ...basicQuery,
    size: "3",
    startDateTime: format(dayjs().add(1, "month")),
  };

  const popQuery = {
    ...basicQuery,
    genreId: Genre.Pop,
  };

  const rockQuery = {
    ...basicQuery,
    genreId: Genre.Rock,
  };

  enum BoardEnum {
    NextMonth = "nextMonth",
    PopEvents = "pop",
    RockEvents = "rock",
  }

  const queries: Record<BoardEnum, Record<string, string>> = {
    [BoardEnum.NextMonth]: nextMonthQuery,
    [BoardEnum.PopEvents]: popQuery,
    [BoardEnum.RockEvents]: rockQuery,
  };

  const queryClient = new QueryClient();
  await Promise.all(
    Object.values(queries).map((query) =>
      queryClient.prefetchQuery({
        queryKey: ["events", query],
        queryFn: () => getEvents(query),
      }),
    ),
  );

  const { t } = translate("it");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Banner title={t("home.banner")} />

      <div className="space-y-12 my-12">
        {Object.values(BoardEnum).map((board) => (
          <Board
            key={board}
            {...(board === BoardEnum.NextMonth && {
              description: t("home.boards.nextMonth.description"),
            })}
            title={t(`home.boards.${board}.title`)}
            variant={board === BoardEnum.NextMonth ? "featured" : "base"}
          >
            <Suspense fallback={<EventsSkeleton />}>
              <Events
                paginated={false}
                params={queries[board]}
                cols={board === BoardEnum.NextMonth ? 3 : 6}
                variant={board === BoardEnum.NextMonth ? "portrait" : "square"}
              />
            </Suspense>
          </Board>
        ))}
      </div>
    </HydrationBoundary>
  );
}
