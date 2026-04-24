import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";
import Banner from "@/components/shared/banner";
import Board from "@/components/shared/board";
import BoardHeader from "@/components/shared/board/header";
import Events from "@/features/events/components/index";
import EventsList from "@/features/events/components/list";
import EventsSkeleton from "@/features/events/components/skeleton";
import { getEvents } from "@/features/events/getEvents";
import { translate } from "@/lib/translate";

export default async function Home() {
  const params = {
    size: "20",
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["events", params],
    queryFn: () => getEvents(params),
  });

  const { t } = translate("it");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="m-4 md:m-8">
        <Banner />
      </section>

      <div className="space-y-12 my-12">
        <Board variant={"featured"}>
          <BoardHeader title={t("home.board.title")}>
            <Link
              href="/search"
              className="hidden lg:block w-fit font-semibold hover:text-blue-300"
            >
              {t("home.board.cta")}
            </Link>
          </BoardHeader>

          <Suspense fallback={<EventsSkeleton />}>
            <Events params={params}>
              <EventsList />
            </Events>
          </Suspense>
        </Board>
      </div>
    </HydrationBoundary>
  );
}
