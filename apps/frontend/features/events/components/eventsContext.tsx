"use client";

import { createContext } from "react";
import React from "react";
import { Ticketmaster } from "@/lib/types";

type EventsContextProps = {
  data: Ticketmaster;
};

const EventsContext = createContext<EventsContextProps | null>(null);

export const useEvents = (): EventsContextProps => {
  const context = React.useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }

  return context;
};

type Props = Readonly<{
  children: React.ReactNode;
  data: Ticketmaster;
}>;
export const EventsProvider = ({ children, data }: Props) => {
  return (
    <EventsContext.Provider value={{ data }}>{children}</EventsContext.Provider>
  );
};
