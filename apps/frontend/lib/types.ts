import { components, operations } from "@/schema";

// Components
type Schemas = components["schemas"];
export type Ticketmaster = Schemas["Ticketmaster"];
export type Event = Schemas["Event"];

// Operations
export type LoginRequest =
  operations["loginUser"]["requestBody"]["content"]["application/json"];
export type RegisterRequest =
  operations["registerUser"]["requestBody"]["content"]["application/json"];
