import dayjs from "dayjs";
import type { Ticketmaster } from "./types";

type Opts = Record<string, string | string[] | null>;

export async function getEvents(opts: Opts) {
  const format = () => {
    const query: string[] = [];
    Object.entries(opts).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length) {
        val.forEach((v) => query.push(`${key}=${v}`));
      }
      if (typeof val === "string" && val.length) {
        query.push(`${key}=${val}`);
      }
    });
    if (!("startDateTime" in opts))
      query.push(`startDateTime=${dayjs().format("YYYY-MM-DDTHH:mm:ss[Z]")}`);
    if (!("size" in opts)) query.push("size=20");

    return query.join("&");
  };

  const params = format();
  try {
    return (await fetch(`http://localhost:8080/events?${params}`).then((res) =>
      res.json(),
    )) as Promise<Ticketmaster>;
  } catch (err) {
    throw new Error("fetching events", err as Error);
  }
}
