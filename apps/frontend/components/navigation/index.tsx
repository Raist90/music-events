"use client";

import { ListFilter } from "lucide-react";
import { AnimatePresence, motion, type MotionProps } from "motion/react";
import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { useOutsideClickRef } from "rooks";
import Labels from "../events/filters/labels";
import MobileMenu from "./mobileMenu";
import MobileMenuSkeleton from "./mobileMenu/skeleton";
import SearchInput from "./searchInput";
import SearchInputSkeleton from "./searchInput/skeleton";
import Filters from "@/components/events/filters";
import CitiesFilter from "@/components/events/filters/cities";
import CountryFilter from "@/components/events/filters/country";
import DatesFilter from "@/components/events/filters/dates";
import { translate } from "@/lib/translate";

const links: Record<"href" | "label", string>[] = [
  { href: "/", label: "LOGO" },
  { href: "/search", label: "Esplora" },
];

const { t } = translate("it");
const filterOptions = [
  { label: t("navigation.filters.labels.country"), value: "country" },
  { label: t("navigation.filters.labels.cities"), value: "cities" },
  { label: t("navigation.filters.labels.dates"), value: "dates" },
];

const filterChildMotionSettings: MotionProps = {
  initial: { x: 10, opacity: 0 },
  animate: { x: 0, opacity: 1, scale: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

enum MenuState {
  CLOSED = "CLOSED",
  FILTERS = "FILTERS",
  NAVIGATION = "NAVIGATION",
  SEARCH_BAR = "SEARCH_BAR",
}

export default function Navigation() {
  const [option, setOption] = useState(filterOptions[0]);
  const [state, setState] = useState(MenuState.CLOSED);

  const [panelRef] = useOutsideClickRef((event) => {
    // Ignore clicks inside the panel
    if (menuRef.current?.contains(event.target as Node)) {
      return;
    }
    setState(MenuState.CLOSED);
  });
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={menuRef}
        className={
          "bg-background/85 backdrop-blur-md py-4 lg:flex justify-between gap-x-4 items-center px-4 md:px-8 text-sm sticky top-0 z-1 hidden border-b border-input"
        }
      >
        {links?.length && (
          <ul className="flex gap-x-4">
            {links.map(({ href, label }) => (
              <li key={href} className="hover:text-blue-300">
                <Link href={href} className="font-bold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-x-4">
          <Suspense fallback={<SearchInputSkeleton />}>
            <SearchInput />
          </Suspense>

          <ListFilter
            onClick={() =>
              setState(
                state === MenuState.FILTERS
                  ? MenuState.CLOSED
                  : MenuState.FILTERS,
              )
            }
            className="cursor-pointer"
            size={20}
          />
        </div>
      </div>

      <Suspense fallback={<MobileMenuSkeleton />}>
        <MobileMenu />
      </Suspense>

      <AnimatePresence>
        {state === MenuState.FILTERS && (
          // TODO: Put this one in a separated component
          <Filters key="filters-panel" ref={panelRef}>
            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4">
              <AnimatePresence mode="wait" initial={false}>
                {option.value === "country" && (
                  <motion.div key="country" {...filterChildMotionSettings}>
                    <CountryFilter />
                  </motion.div>
                )}
                {option.value === "cities" && (
                  <motion.div key="cities" {...filterChildMotionSettings}>
                    <CitiesFilter />
                  </motion.div>
                )}
                {option.value === "dates" && (
                  <motion.div key="dates" {...filterChildMotionSettings}>
                    <DatesFilter />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Labels
              options={filterOptions}
              selected={option}
              handleSelect={setOption}
            />
          </Filters>
        )}
      </AnimatePresence>
    </>
  );
}
