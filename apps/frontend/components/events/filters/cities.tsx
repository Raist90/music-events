'use client'

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"

const deCities = [
  'Berlin',
  'Hamburg',
  'München'
]

const frCities = [
  'Lione',
  'Marsiglia',
  'Nizza',
  'Parigi',
  'Tolosa'
]

const gbCities = [
  'Birmingham',
  'Edinburgh',
  'Glasgow',
  'Leeds',
  'Liverpool',
  'London',
  'Manchester'
]

const esCities = [
  'Barcelona',
  'Madrid',
  'Valencia'
]

const itCities = [
  'Bergamo',
  'Bologna',
  'Firenze',
  'Milano',
  'Napoli',
  'Padova',
  'Roma',
  'Torino',
  'Verona'
]

const usCities = [
  'Atlanta',
  'Boston',
  'Chicago',
  'Dallas',
  'Denver',
  'Houston',
  'Los Angeles',
  'Miami',
  'New York',
  'Orlando',
  'Philadelphia',
  'San Francisco',
  'Seattle',
  'Washington'
]

const citiesMap: Record<string, string[]> = {
  DE: deCities,
  FR: frCities,
  GB: gbCities,
  ES: esCities,
  IT: itCities,
  US: usCities,
}

export default function CitiesFilter() {
  const searchParams = useSearchParams()
  const country = searchParams.get('country')
  const cities = searchParams.getAll('city')

  const router = useRouter();
  const onChecked = (city: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams)

    if (checked) params.append('city', city)
    else {
      params.delete('city')
      cities.filter((c) => c !== city).forEach((c) => params.append('city', c))
    }

    params.set('page', '0')
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex gap-x-2">
      {country && citiesMap[country]?.length && citiesMap[country].map((city) => (
        <div className="flex gap-x-2" key={city}>
          <Checkbox checked={cities.includes(city.toLowerCase())} onCheckedChange={(checked) => onChecked(city.toLowerCase(), checked as boolean)} id={city} />
          <Label htmlFor={city}>{city}</Label>
        </div>
      ))}
    </div>
  )
}
