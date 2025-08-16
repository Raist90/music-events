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

type Res = {
  _embedded: {
    events: Event[];
  }
}

export default async function Home() {
  const data = await fetch("http://localhost:8080/events")
  const res = await data.json() as Res

  return (
    <div>
      <ul className="grid grid-cols-3">{res._embedded.events.map((event) => (
        <li key={event.id}>
          <h2>{event.name}</h2>
          <p>{event.dates.start.localTime}</p>
        </li>
      ))}
      </ul>
    </div>
  );
}
