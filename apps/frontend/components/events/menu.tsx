'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  initialValue?: string;
  items: string[];
  onSelect: (value: string) => Promise<void>;
}

export default function Menu({ initialValue, items: cities, onSelect }: Props) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="w-full px-8 py-4 sticky top-0 bg-background border-b border-input">
      <div className="flex gap-x-8 items-center">
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
      </div>
    </div>
  )
}
