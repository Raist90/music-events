import { cn } from "@/lib/utils";

type Props<T> = Readonly<{
  className?: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}>;

export default function List<T extends { id?: string }>({
  className = "md:grid-cols-3 lg:grid-cols-5",
  items,
  renderItem,
}: Props<T>) {
  return (
    <ul className={cn("grid gap-8", className)}>
      {items.map((item, index) => (
        <li key={item.id ?? index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
