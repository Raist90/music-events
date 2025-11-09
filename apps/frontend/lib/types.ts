import { components } from "@/schema";

type Schemas = components["schemas"];

export type Ticketmaster = Schemas["Ticketmaster"];
export type Page = Ticketmaster["page"];

export type Event = Schemas["Event"];
