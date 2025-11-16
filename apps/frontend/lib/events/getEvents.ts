import { apiClient } from "../client";

type Opts = Record<string, string | string[] | null>;

export async function getEvents(opts: Opts) {
  if (Array.isArray(opts?.city)) {
    // Replace spaces with plus signs for URL encoding
    opts.city = opts.city.map((c) => c.replace(" ", "+"));
  }

  try {
    const { data } = await apiClient.GET("/events", {
      params: {
        query: opts,
      },
    });
    if (!data) {
      throw new Error("No data returned from API");
    }
    return data;
  } catch (err) {
    throw new Error("fetching events", { cause: err });
  }
}
