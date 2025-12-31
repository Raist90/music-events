"use client";

import { ListFilter } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobileMenu";
import MobileMenuSkeleton from "./mobileMenu/skeleton";
import SearchInput from "./searchInput";
import SearchInputSkeleton from "./searchInput/skeleton";
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

const links: Record<"href" | "label", string>[] = [
  { href: "/", label: "LOGO" },
  { href: "/search", label: "Esplora" },
];

export default function Navigation() {
  return (
    <>
      <div
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

          <Drawer>
            <DrawerTrigger asChild>
              <ListFilter className="cursor-pointer" size={20} />
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

      <Suspense fallback={<MobileMenuSkeleton />}>
        <MobileMenu />
      </Suspense>
    </>
  );
}
