import { apiClient } from "../client";

type Opts = Record<string, string | string[] | null>;

export async function getEvents(opts: Opts) {
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
