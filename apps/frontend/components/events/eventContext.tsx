import { createContext, useContext } from "react";

export type EventVariant = "landscape" | "portrait" | "square";
export const EventContext = createContext<EventVariant>("landscape");

export const useEvent = () => ({
  variant: useContext(EventContext),
});
