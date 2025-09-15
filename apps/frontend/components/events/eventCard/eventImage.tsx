import type { Event } from "@/lib/events/types";
import { cva } from "class-variance-authority";

type Props = Readonly<{
  event: Event;
  variant?: "landscape" | "portrait" | "square";
}>;

const wrapperClass = cva("w-full", {
  variants: {
    variant: {
      landscape: "aspect-video",
      portrait: "aspect-[2/3]",
      square: "aspect-square",
    },
  },
});

const imgClass = cva("size-full rounded-md", {
  variants: {
    variant: {
      landscape: "object-fill",
      portrait: "object-cover",
      square: "object-cover",
    },
  },
});

export default function EventImage({ event, variant = "landscape" }: Props) {
  return (
    <div className={wrapperClass({ variant })}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={imgClass({ variant })}
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
