import { tv } from "tailwind-variants";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import EventCard from "./eventCard";
import { EventProvider } from "./eventContext";
import { Event } from "@/lib/events/types";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  cols?: 3 | 4 | 5 | 6;
  events: Event[];
  variant?: "landscape" | "portrait" | "square";
}>;

const eventsCarousel = tv({
  variants: {
    cols: {
      3: "lg:basis-1/3",
      4: "md:basis-1/2 lg:basis-1/4",
      5: "lg:basis-1/5",
      6: "lg:basis-1/6",
    },
    variant: {
      landscape: "",
      portrait: "",
      square: "",
    },
    defaultVariants: {
      cols: 4,
      variant: "landscape",
    },
  },
});

const EventsCarousel = ({ cols = 4, events, variant = "landscape" }: Props) => {
  return (
    <Carousel>
      <CarouselContent className="-ml-8 pr-24">
        {events.map((event) => (
          <CarouselItem
            className={cn(eventsCarousel({ cols }), "pl-8")}
            key={event.id}
          >
            <EventProvider event={event} variant={variant}>
              <EventCard />
            </EventProvider>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default EventsCarousel;
