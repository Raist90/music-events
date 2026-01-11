"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { countriesMap } from "@/lib/events/countries";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  initialValue?: string;
}>;

const countries: string[] = ["DE", "ES", "FR", "GB", "IT", "US"];

export default function CountryFilter({ initialValue = "IT" }: Props) {
  const params = useSearchParams();
  const selectedCountryCode = params.get("countryCode");

  const router = useRouter();
  return (
    <div className="flex gap-2 text-sm overflow-auto mask-fade-x-4 px-4 -mx-4 [scrollbar-width:none]">
      {countries
        .sort((a, b) => countriesMap[a].localeCompare(countriesMap[b]))
        .map((country) => (
          <button
            className={cn(
              country === (selectedCountryCode || initialValue) &&
                "text-blue-300",
              "bg-input/50 rounded border font-semibold border-input py-1 px-2 flex items-center shrink-0",
            )}
            key={country}
            disabled={country === selectedCountryCode}
            onClick={() => router.push(`/search?countryCode=${country}&page=0`)}
          >
            {countriesMap[country]}
          </button>
        ))}
    </div>
  );
}
