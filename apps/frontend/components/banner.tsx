import { cn } from "@/lib/utils";
import Fallback from "../public/banner.jpg";
import { StaticImageData } from "next/image";

type Props = Readonly<{
  className?: string;
  media?: StaticImageData;
  title: string;
}>;

export default function Banner({ className, media: _media, title }: Props) {
  const media = _media || Fallback;

  return (
    <section
      className={cn(
        "relative w-full grid h-[500px] lg:h-[700px] bg-black/60",
        className,
      )}
    >
      <header className="place-self-center w-11/12 lg:w-4/12 text-center text-balance">
        <h2 className="text-4xl md:text-5xl font-bold font-title">{title}</h2>
      </header>

      <div className="absolute inset-0 -z-[2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt="Home banner"
          className="object-cover size-full"
        />
      </div>

      <div className="absolute inset-0 bg-conic/decreasing from-violet-700 -z-[2] via-lime-300 to-violet-700 opacity-10"></div>
    </section>
  );
}
