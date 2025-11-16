"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countriesMap } from "@/lib/events/countries";

type Props = Readonly<{
  initialValue?: string;
}>;

const countries: string[] = ["DE", "ES", "FR", "GB", "IT", "US"];

export default function CountryFilter({ initialValue }: Props) {
  const params = useSearchParams();
  const selectedCountry = params.get("country");

  const router = useRouter();
  return (
    <Select
      value={initialValue}
      onValueChange={(val) => router.push(`/search?country=${val}&page=0`)}
    >
      <SelectTrigger className="min-w-40">
        <SelectValue placeholder="Seleziona nazione" />
      </SelectTrigger>
      <SelectContent className="w-40">
        <SelectGroup>
          <SelectLabel>Nazione</SelectLabel>
          {countries.map((country) => (
            <SelectItem
              disabled={country === selectedCountry}
              key={country}
              value={country}
            >
              {countriesMap[country]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
