import { tv } from "tailwind-variants";
import { EventVariant, useEvent } from "../eventContext";

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
    } satisfies Record<EventVariant, Record<string, string>>,
  },
});

export default function EventImage() {
  const { event, variant } = useEvent();

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
