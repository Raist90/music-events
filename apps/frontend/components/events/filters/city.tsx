'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Props = Readonly<{
  initialValue?: string;
}>

const cities: string[] = [
  "Bologna",
  "Catania",
  "Firenze",
  "Genova",
  "Milano",
  "Napoli",
  "Palermo",
  "Roma",
  "Torino",
  "Venezia"
];

export default function CityFilter({ initialValue }: Props) {
  const router = useRouter();
  const onSelect = async (val: string) => router.push(`/search?city=${val}&page=0`)

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder={initialValue ? capitalize(initialValue) : 'Seleziona città'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Città</SelectLabel>
          {cities.map((city) => (
            <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
