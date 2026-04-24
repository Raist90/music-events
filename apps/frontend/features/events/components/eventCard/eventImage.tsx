import Image from "next/image";
import { tv } from "tailwind-variants";
import { EventVariant, useEvent } from "../eventContext";

const eventImage = tv({
  slots: {
    wrapper: "w-full",
    img: "size-full",
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
  const image = event.images.find(
    ({ ratio, width }) => ratio === "16_9" && width > 1000,
  );

  if (!image) {
    return null;
  }

  return (
    <div className={eventImage({ variant }).wrapper()}>
      <Image
        className={eventImage({ variant }).img()}
        src={image.url}
        alt={event.name}
        width={image.width}
        height={image.height}
      />
    </div>
  );
}
