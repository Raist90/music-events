import type { Event } from "@/lib/events/types";
import { tv } from "tailwind-variants";

type Props = Readonly<{
  event: Event;
  variant?: "landscape" | "portrait" | "square";
}>;

const eventImage = tv({
  slots: {
    wrapper: "w-full",
    img: "size-full rounded-md",
  },
  variants: {
    variant: {
      landscape: {
        wrapper: "aspect-video",
        img: "object-fill",
      },
      portrait: {
        wrapper: "aspect-[2/3]",
        img: "object-cover",
      },
      square: {
        wrapper: "aspect-square",
        img: "object-cover",
      },
    },
  },
});

export default function EventImage({ event, variant = "landscape" }: Props) {
  return (
    <div className={eventImage({ variant }).wrapper()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={eventImage({ variant }).img()}
        src={
          event.images.find(
            ({ ratio, width }) => ratio === "16_9" && width > 1000,
          )?.url
        }
        alt={event.name}
      />
    </div>
  );
}
