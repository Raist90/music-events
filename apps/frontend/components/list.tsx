import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { cn } from "@/lib/utils";

type Props<T> = Readonly<{
  className?: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  showCarousel?: boolean;
}>;

export default function List<T extends { id?: string }>({
  className = "lg:grid-cols-4",
  items,
  renderItem,
  showCarousel = false,
}: Props<T>) {
  if (showCarousel)
    return (
      <CarouselList
        className={className}
        items={items}
        renderItem={renderItem}
      />
    );

  return (
    <ul className={cn("grid gap-8", className)}>
      {items.map((item, index) => (
        <li key={item.id ?? index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

function CarouselList<T extends { id?: string }>({
  className,
  items,
  renderItem,
}: Props<T>) {
  console.log(className);

  return (
    <Carousel>
      <CarouselContent className="-ml-8 pr-24">
        {items.map((item, index) => (
          <CarouselItem
            className={cn("pl-8", className)}
            key={item.id ?? index}
          >
            {renderItem(item)}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
