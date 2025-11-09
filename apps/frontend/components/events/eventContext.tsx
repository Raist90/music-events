import { createContext, useContext } from "react";
import type { Event } from "@/lib/types";

export type EventVariant = "landscape" | "portrait" | "square";

type EventContextProps = {
  event: Event;
  variant: EventVariant;
};

const EventContext = createContext<EventContextProps | null>(null);

export const useEvent = (): EventContextProps => {
  const context = useContext(EventContext);
  if (!context) {
    throw "useEvent must be used within an EventProvider";
  }

  return {
    event: context.event,
    variant: context.variant,
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
