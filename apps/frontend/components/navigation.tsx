import { Plus } from "lucide-react";
import Link from "next/link";
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

type Props = Readonly<{
  // TODO: Make make this one a `filters` object
  countryCode?: string;
}>;

const links: Record<"href" | "label", string>[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Esplora" },
];

export default function Navigation({ countryCode }: Props) {
  return (
    <div
      className={
        "bg-background/85 backdrop-blur-md border-b border-input h-14 flex gap-x-4 items-center px-8 py-4 text-sm sticky top-0 z-[1]"
      }
    >
      {links?.length && (
        <ul className="flex gap-x-4 ">
          {links.map(({ href, label }) => (
            <li key={href} className="hover:text-blue-300">
              <Link href={href} className="font-bold">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Drawer>
        <DrawerTrigger className="ml-auto" asChild>
          <button className="font-semibold flex gap-x-1 items-center cursor-pointer">
            Filtri
            <Plus className="size-4" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="!rounded-none">
          <DrawerHeader>
            <DrawerTitle>Filtri</DrawerTitle>
            <DrawerDescription>
              Seleziona i filtri per la ricerca
            </DrawerDescription>
          </DrawerHeader>
          <Filters>
            <DatesFilter />

            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-4 lg:items-center">
              <CountryFilter
                {...(typeof countryCode === "string" && {
                  initialValue: countryCode,
                })}
              />
              <CitiesFilter />
            </div>
          </Filters>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
