import {
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString,
} from "nuqs/server";

const searchParamsSchema = {
  attractionId: parseAsString,
  city: parseAsArrayOf(parseAsString).withDefault([]),
  countryCode: parseAsString.withDefault("IT"),
  endDateTime: parseAsIsoDateTime,
  genreId: parseAsString,
  keyword: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(20),
  startDateTime: parseAsIsoDateTime,
};

export const serializeSearchParams = createSerializer(searchParamsSchema);
