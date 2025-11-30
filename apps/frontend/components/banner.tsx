import { StaticImageData } from "next/image";
import Fallback from "../public/banner.jpg";

type Props = Readonly<{
  className?: string;
  media?: StaticImageData;
  title: string;
}>;

export default function Banner({ className, media: _media, title }: Props) {
  const media = _media || Fallback;

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.src}
        alt="Home banner"
        className="object-cover size-full shrink-0 h-[500px] md:h-[600px]"
      />
    </div>
  );
}
