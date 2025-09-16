import { Event } from "@/lib/events/types";
import { createContext, useContext } from "react";

export type EventVariant = "landscape" | "portrait" | "square";
type Ctx = {
  event: Event;
  variant: EventVariant;
};

const EventContext = createContext<Partial<Ctx>>({
  variant: "landscape",
});
export const useEvent = (): Ctx => {
  const ctx = useContext(EventContext);
  if (!ctx.event) {
    throw "useEvent must be used within an EventProvider";
  }

  return {
    event: ctx.event,
    variant: ctx.variant || "landscape",
  };
};

type Props = Readonly<{
  children: React.ReactNode;
  event: Event;
  variant: EventVariant;
}>;

export const EventProvider = ({ children, event, variant }: Props) => {
  return (
    <EventContext.Provider value={{ event, variant }}>
      {children}
    </EventContext.Provider>
  );
};
