"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countriesMap } from "@/lib/events/countries";

type Props = Readonly<{
  initialValue?: string;
}>;

const countries: string[] = ["DE", "ES", "FR", "GB", "IT", "US"];

export default function CountryFilter({ initialValue = "IT" }: Props) {
  const params = useSearchParams();
  const selectedCountryCode = params.get("countryCode");

  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-xs font-bold uppercase">Paese</span>

      <Select
        value={selectedCountryCode ?? initialValue}
        onValueChange={(val) =>
          router.push(`/search?countryCode=${val}&page=0`)
        }
      >
        <SelectTrigger className="w-full md:min-w-40">
          <SelectValue placeholder="Seleziona nazione" />
        </SelectTrigger>
        <SelectContent className="w-40">
          <SelectGroup>
            {countries.map((country) => (
              <SelectItem
                disabled={country === selectedCountryCode}
                key={country}
                value={country}
              >
                {countriesMap[country]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
