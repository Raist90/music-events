"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { countriesMap } from "@/lib/events/countries";

const countries: string[] = ["DE", "ES", "FR", "GB", "IT", "US"];
const initialCountry = "IT";

export default function FilterCountry() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const selectedCountry = searchParams.get("countryCode") || initialCountry;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="w-fit flex gap-x-2 items-center py-1 px-3 border bg-input/50 font-semibold rounded text-sm">
            {countriesMap[selectedCountry]}
            <ChevronsUpDownIcon size={14} />
          </button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="rounded w-60">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup value={selectedCountry}>
            {countries
              .sort((a, b) => countriesMap[a].localeCompare(countriesMap[b]))
              .map((country) => (
                <DropdownMenuRadioItem
                  className={
                    country === selectedCountry
                      ? "text-blue-300 data-disabled:opacity-100"
                      : ""
                  }
                  disabled={country === selectedCountry}
                  onClick={() =>
                    router.push(`/search?countryCode=${country}&page=0`)
                  }
                  value={country}
                  key={country}
                >
                  {countriesMap[country]}
                </DropdownMenuRadioItem>
              ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
