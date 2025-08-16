type Ticketmaster = {
  _embedded: {
    events: Event[];
  }
}

type Event = {
  classifications: Classification[];
  dates: Dates;
  id: string;
  name: string;
}

type Classification = {
  id: string;
  name: string;
}

type Dates = {
  start: {
    dateTBA: boolean;
    dateTBD: boolean;
    dateTime: string;
    localDate: string;
    localTime: string;
    noSpecificTime: boolean;
    timeTBA: boolean;
  }
}

export async function getEvents() {
  try {
    return await fetch("http://localhost:8080/events").then(res => res.json()) as Promise<Ticketmaster>;
  } catch (err) {
    throw new Error('fetching events', err as Error);
  }
}

