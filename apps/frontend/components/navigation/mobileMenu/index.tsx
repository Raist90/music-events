import { ListFilter, Menu, Search } from "lucide-react";
import { AnimatePresence, motion, type MotionProps } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useOutsideClickRef } from "rooks";
import SearchInput from "../searchInput";
import Filters from "@/components/events/filters";
import CitiesFilter from "@/components/events/filters/cities";
import CountryFilter from "@/components/events/filters/country";
import DatesFilter from "@/components/events/filters/dates";
import Labels from "@/components/events/filters/labels";
import { translate } from "@/lib/translate";

const { t } = translate("it");
const filterOptions = [
  { label: t("navigation.filters.labels.country"), value: "country" },
  { label: t("navigation.filters.labels.cities"), value: "cities" },
  { label: t("navigation.filters.labels.dates"), value: "dates" },
];

const links: Record<"href" | "label", string>[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Esplora" },
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

export default function MobileMenu() {
  const params = useSearchParams();

  const [state, setState] = useState(
    params.get("keyword") ? MenuState.SEARCH_BAR : MenuState.CLOSED,
  );

  function toggleMenuState(type: MenuState) {
    if (state === type) {
      setState(MenuState.CLOSED);
      return;
    }
    setState(type);
  }

  const [option, setOption] = useState(filterOptions[0]);

  const [menuRef] = useOutsideClickRef((event) => {
    // Ignore clicks inside the panel
    if (panelRef.current?.contains(event.target as Node)) {
      return;
    }
    setState(MenuState.CLOSED);
  });
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={menuRef}
      className="lg:hidden sticky w-full top-0 z-1 bg-background/85 backdrop-blur-md"
    >
      <div className="flex gap-3 items-center justify-between border-b border-input p-4">
        <div className="flex flex-1 gap-3 items-center">
          <button
            className="cursor-pointer"
            onClick={() => toggleMenuState(MenuState.NAVIGATION)}
          >
            <Menu
              {...(state === MenuState.NAVIGATION
                ? { className: "text-blue-300" }
                : {})}
              size={20}
            />
          </button>
        </div>

        <div className="flex-2 text-center">
          <Link href="/">
            <h1 className="font-bold">LOGO</h1>
          </Link>
        </div>

        <div className="flex flex-1 gap-3 items-center justify-end">
          <button
            className="cursor-pointer"
            onClick={() => toggleMenuState(MenuState.SEARCH_BAR)}
          >
            <Search
              {...(state === MenuState.SEARCH_BAR
                ? { className: "text-blue-300" }
                : {})}
              size={20}
            />
          </button>

          <button
            className="cursor-pointer"
            onClick={() => toggleMenuState(MenuState.FILTERS)}
          >
            <ListFilter
              {...(state === MenuState.FILTERS
                ? { className: "text-blue-300" }
                : {})}
              size={20}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {state !== MenuState.CLOSED && state !== MenuState.FILTERS && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="absolute w-full bg-background overflow-hidden border-b border-input"
          >
            <AnimatePresence mode="wait" initial={false}>
              {state === MenuState.NAVIGATION && (
                <motion.ul
                  key="navigation"
                  initial={{
                    x: -100,
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{
                    x: -100,
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-4 space-y-2 text-sm uppercase font-semibold"
                >
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link className="hover:text-blue-300" href={href}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}

              {state === MenuState.SEARCH_BAR && (
                <motion.div
                  key="search"
                  initial={{
                    x: 100,
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{
                    x: 100,
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-4"
                >
                  <SearchInput />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === MenuState.FILTERS && (
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
    </div>
  );
}
