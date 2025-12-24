import { ListFilter, Menu, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import SearchInput from "./searchInput";
import Filters from "@/components/events/filters";
import CitiesFilter from "@/components/events/filters/cities";
import CountryFilter from "@/components/events/filters/country";
import DatesFilter from "@/components/events/filters/dates";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { serializeSearchParams } from "@/lib/events/serializeSearchParams";

const links: Record<"href" | "label", string>[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Esplora" },
];

enum MenuState {
  CLOSED = "CLOSED",
  NAVIGATION = "NAVIGATION",
  SEARCH_BAR = "SEARCH_BAR",
}

export default function MobileMenu() {
  const router = useRouter();
  const params = useSearchParams();

  const [state, setState] = React.useState(
    params.get("keyword") ? MenuState.SEARCH_BAR : MenuState.CLOSED,
  );

  function toggleMenuState(type: MenuState) {
    if (state === type) {
      setState(MenuState.CLOSED);
      return;
    }
    setState(type);
  }

  function onHandleSearch(query: string) {
    const url = serializeSearchParams(`/search?${params.toString()}`, {
      keyword: query || null,
    });
    router.push(url, { scroll: false });
  }

  return (
    <div className="lg:hidden sticky w-full top-0 z-1 bg-background/85 backdrop-blur-md">
      <div className="flex gap-3 items-center justify-between border-b border-input p-4">
        <div className="flex flex-1 gap-3 items-center">
          <button
            className="cursor-pointer"
            onClick={() => toggleMenuState(MenuState.NAVIGATION)}
          >
            <Menu size={20} />
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
            <Search size={20} />
          </button>

          <Drawer>
            <DrawerTrigger asChild>
              <ListFilter size={20} />
            </DrawerTrigger>
            <DrawerContent className="rounded-none!">
              <DrawerHeader>
                <DrawerTitle>Filtri</DrawerTitle>
                <DrawerDescription>
                  Seleziona i filtri per la ricerca
                </DrawerDescription>
              </DrawerHeader>
              <Filters>
                <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4">
                  <CountryFilter />
                  <CitiesFilter />
                  <DatesFilter />
                </div>
              </Filters>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <AnimatePresence>
        {state !== MenuState.CLOSED && (
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
                  className="p-4 space-y-2"
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
                  <SearchInput handleSearch={onHandleSearch} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
