type Ticketmaster = {
  _embedded: {
    events: Event[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

type Event = {
  dates: Dates;
  _embedded: EventEmbedded;
  id: string;
  images: Image[];
  name: string;
  url: string;
}

type EventEmbedded = {
  venues: Venue[];
}

type Venue = {
  address: {
    line1: string;
  };
  city: {
    name: string;
  };
  country: {
    countryCode: string;
    name: string;
  };
  id: string;
  locale: string;
  location: {
    latitude: number;
    longitude: number;
  };
  name: string;
  postalCode: string;
  state: {
    country: {
      countryCode: string;
      name: string;
    }
  };
  test: boolean;
  timezone: string;
  type: string;
  url: string;
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

type Image = {
  fallback: boolean;
  height: number;
  width: number;
  ratio: string;
  url: string;
}

export async function getEvents() {
  try {
    return await fetch("http://localhost:8080/events").then(res => res.json()) as Promise<Ticketmaster>;
  } catch (err) {
    throw new Error('fetching events', err as Error);
  }
}

