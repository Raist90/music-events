"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const onSelect = async (val: string) => {
    router.prefetch(`/search?country=${val}&page=0`);
    router.push(`/search?country=${val}&page=0`);
  };

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="min-w-40">
        <SelectValue
          placeholder={
            initialValue ? countriesMap[initialValue] : "Seleziona nazione"
          }
        />
      </SelectTrigger>
      <SelectContent className="w-40">
        <SelectGroup>
          <SelectLabel>Nazione</SelectLabel>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {countriesMap[country]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
