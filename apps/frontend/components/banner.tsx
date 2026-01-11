import Image, { StaticImageData } from "next/image";
import Fallback from "../public/banner.jpg";

type Props = Readonly<{
  className?: string;
  media?: StaticImageData;
}>;

export default function Banner({ className, media: _media }: Props) {
  const media = _media || Fallback;

  return (
    <div className={className}>
      <Image
        src={media.src}
        alt="Home banner"
        className="object-cover size-full shrink-0 h-125 md:h-150"
        width={1920}
        height={600}
        priority
      />
    </div>
  );
}
