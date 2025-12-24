import { ReadonlyURLSearchParams } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

export function getParams(
  searchParams: SearchParams,
): Record<string, string | string[] | null> {
  const {
    page,
    countryCode,
    city,
    attractionId,
    startDateTime,
    endDateTime,
    genreId,
    keyword,
  } = searchParams;

  return {
    city: Array.isArray(city) ? city : city ? [city] : [],
    countryCode: countryCode || null,
    page: page || "0",
    attractionId: attractionId || null,
    startDateTime: startDateTime || null,
    endDateTime: endDateTime || null,
    genreId: genreId || null,
    keyword: keyword || null,
  };
}

export function getReadonlyParams(
  searchParams: ReadonlyURLSearchParams,
): Record<string, string | string[] | null> {
  const city = searchParams.getAll("city");
  const countryCode = searchParams.get("countryCode");
  const page = searchParams.get("page") || "0";
  const attractionId = searchParams.get("attractionId");
  const startDateTime = searchParams.get("startDateTime");
  const endDateTime = searchParams.get("endDateTime");
  const genreId = searchParams.get("genreId");
  const keyword = searchParams.get("keyword");

  return {
    city,
    countryCode,
    page,
    attractionId,
    startDateTime,
    endDateTime,
    genreId,
    keyword,
  };
}
