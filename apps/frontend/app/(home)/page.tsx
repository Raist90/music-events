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

export default async function Home() {
  // TODO: Find a way to reuse this
  const format = (dateTime: ReturnType<typeof dayjs>) =>
    dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss[Z]");
  const basicQuery = {
    size: "4",
  };

  const nextMonthQuery = {
    ...basicQuery,
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

  enum Section {
    NextMonth = "nextMonth",
    PopEvents = "pop",
    RockEvents = "rock",
  }

  const queries: Record<Section, Record<string, string>> = {
    [Section.NextMonth]: nextMonthQuery,
    [Section.PopEvents]: popQuery,
    [Section.RockEvents]: rockQuery,
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
        {Object.values(Section).map((section) => (
          <section key={section} className="space-y-4">
            <h3 className="font-title font-semibold px-8 uppercase">
              {t(`home.sections.${section}.title`)}
            </h3>
            <Suspense fallback={<EventsSkeleton />}>
              <Events paginated={false} params={queries[section]} />
            </Suspense>
          </section>
        ))}
      </div>
    </HydrationBoundary>
  );
}
