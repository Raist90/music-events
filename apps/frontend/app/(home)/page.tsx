import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import { Suspense } from "react";
import Banner from "@/components/banner";
import Board from "@/components/board";
import Events from "@/components/events";
import EventsSkeleton from "@/components/events/skeleton";
import { Genre } from "@/lib/events/genres";
import { getEvents } from "@/lib/events/getEvents";
import { translate } from "@/lib/translate";

export default async function Home() {
  // TODO: Find a way to reuse this
  const format = (dateTime: ReturnType<typeof dayjs>) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");

  const baseQuery = {
    size: "6",
  };

  const nextMonthQuery = {
    ...baseQuery,
    startDateTime: format(dayjs().add(1, "month")),
  };

  const popQuery = {
    ...baseQuery,
    genreId: Genre.Pop,
  };

  const rockQuery = {
    ...baseQuery,
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
                variant={board === BoardEnum.NextMonth ? "portrait" : "square"}
                {...(board === BoardEnum.NextMonth && { showCarousel: true })}
              />
            </Suspense>
          </Board>
        ))}
      </div>
    </HydrationBoundary>
  );
}
