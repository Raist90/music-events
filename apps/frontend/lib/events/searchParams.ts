import { ReadonlyURLSearchParams } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export function getParams(
  searchParams: SearchParams,
): Record<string, string | string[] | null> {
  const {
    page,
    country,
    city,
    attractionId,
    startDateTime,
    endDateTime,
    genreId,
  } = searchParams;

  return {
    city: Array.isArray(city) ? city : city ? [city] : [],
    country: country || null,
    page: page || "0",
    attractionId: attractionId || null,
    startDateTime: startDateTime || null,
    endDateTime: endDateTime || null,
    genreId: genreId || null,
  };
}

export function getReadonlyParams(
  searchParams: ReadonlyURLSearchParams,
): Record<string, string | string[] | null> {
  const city = searchParams.getAll("city");
  const country = searchParams.get("country");
  const page = searchParams.get("page") || "0";
  const attractionId = searchParams.get("attractionId");
  const startDateTime = searchParams.get("startDateTime");
  const endDateTime = searchParams.get("endDateTime");
  const genreId = searchParams.get("genreId");

  return {
    city,
    country,
    page,
    attractionId,
    startDateTime,
    endDateTime,
    genreId,
  };
}
