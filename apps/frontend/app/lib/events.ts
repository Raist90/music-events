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

type Attraction = {
  classifications: {
    genre: {
      id: string;
      name: string;
    };
    family: boolean;
    primary: boolean;
    segment: {
      id: string;
      name: string;
    };
    subgenre: {
      id: string;
      name: string;
    };
    subtype: {
      id: string;
      name: string;
    };
    type: {
      id: string;
      name: string;
    };
  }[];
  id: string;
  images: Image[];
  locale: string;
  name: string;
  test: boolean;
  type: string;
  url: string;
}

export type Event = {
  dates: Dates;
  _embedded: EventEmbedded;
  id: string;
  images: Image[];
  name: string;
  url: string;
}

type EventEmbedded = {
  attractions: Attraction[];
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

type opts = {
  city?: string[];
  country?: string;
  page?: string;
  attractionId?: string;
}

export async function getEvents(opts: opts = { page: "0" }) {
  const attractionId = opts.attractionId ? `&attractionId=${opts.attractionId}` : ''
  try {
    return await fetch(`http://localhost:8080/events?country=${opts.country || ""}&city=${opts.city || ""}${attractionId}&page=${opts.page}`).then(res => res.json()) as Promise<Ticketmaster>;
  } catch (err) {
    throw new Error('fetching events', err as Error);
  }
}

