"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/translate";

const deCities = ["Berlin", "Hamburg", "München"];

const frCities = ["Lione", "Marsiglia", "Nizza", "Parigi", "Tolosa"];

const gbCities = [
  "Birmingham",
  "Edinburgh",
  "Glasgow",
  "Leeds",
  "Liverpool",
  "London",
  "Manchester",
];

const esCities = ["Barcelona", "Madrid", "Valencia"];

const itCities = [
  "Bergamo",
  "Bologna",
  "Firenze",
  "Milano",
  "Napoli",
  "Padova",
  "Roma",
  "Torino",
  "Verona",
];

const usCities = [
  "Atlanta",
  "Boston",
  "Chicago",
  "Dallas",
  "Denver",
  "Houston",
  "Los Angeles",
  "Miami",
  "New York",
  "Orlando",
  "Philadelphia",
  "San Francisco",
  "Seattle",
  "Washington",
];

const citiesMap: Record<string, string[]> = {
  DE: deCities,
  FR: frCities,
  GB: gbCities,
  ES: esCities,
  IT: itCities,
  US: usCities,
};

export default function FilterCities() {
  const searchParams = useSearchParams();
  const countryCode = searchParams.get("countryCode") ?? "IT";
  const cities = searchParams.getAll("city");

  const router = useRouter();

  function onChecked(city: string, checked: boolean) {
    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.append("city", city);
    } else {
      params.delete("city");
      cities.filter((c) => c !== city).forEach((c) => params.append("city", c));
    }

    params.set("page", "0");
    params.sort();
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

  const { t } = translate("it");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="w-fit flex gap-x-2 items-center py-1 px-3 border bg-input/50 font-semibold rounded text-sm">
            <span className="capitalize">
              {searchParams.getAll("city").length > 1
                ? `${searchParams.get("city")} ${t("navigation.filters.cities.and_more", { count: String(searchParams.getAll("city").length - 1) })}`
                : searchParams.get("city") ||
                  t("navigation.filters.cities.select_cities")}
            </span>

            <ChevronsUpDownIcon size={14} />
          </button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="rounded">
        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            checked={cities.length === 0}
            onCheckedChange={() => {
              const params = new URLSearchParams(searchParams);
              params.delete("city");
              params.set("page", "0");
              params.sort();
              router.push(`/search?${params.toString()}`, {
                scroll: false,
              });
            }}
            onSelect={(e) => e.preventDefault()}
          >
            {t("navigation.filters.cities.all_cities")}
          </DropdownMenuCheckboxItem>

          <DropdownMenuRadioGroup>
            {citiesMap[countryCode].map((city) => (
              <DropdownMenuCheckboxItem
                checked={cities.includes(city.toLowerCase())}
                onCheckedChange={(checked) => {
                  onChecked(city.toLowerCase(), checked as boolean);
                }}
                onSelect={(e) => e.preventDefault()}
                key={city}
              >
                {city}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
