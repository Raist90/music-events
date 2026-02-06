import { apiClient } from "../client";

type Opts = Record<string, string | string[] | null>;

export async function getEvents(opts: Opts) {
  try {
    const { data, error } = await apiClient.GET("/events", {
      params: {
        query: {
          attractionId: formatQuery(opts.attractionId),
          city: formatQuery(opts.city),
          classificationName: "music",
          countryCode: formatQuery(opts.countryCode) || "IT",
          endDateTime: formatQuery(opts.endDateTime),
          genreId: formatQuery(opts.genreId),
          keyword: formatQuery(opts.keyword),
          locale:
            formatQuery(opts.countryCode) === "GB" ||
            formatQuery(opts.countryCode) === "US"
              ? "en"
              : formatQuery(opts.countryCode || "IT")?.toLowerCase(),
          page: formatQuery(opts.page) || "0",
          size: formatQuery(opts.size) || "20",
          sort: "date,asc",
          startDateTime: formatQuery(opts.startDateTime),
        },
      },
    });
    if (error) throw error;
    return data;
  } catch (err) {
    throw new Error("fetching events", { cause: err });
  }
}

function formatQuery(param: string | string[] | null): string | undefined {
  if (param === null) return;

  if (Array.isArray(param)) {
    if (param.length === 0) return;
    return param.join(",").replace(/ /g, "+");
  }

  return param;
}
