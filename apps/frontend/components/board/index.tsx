import { tv } from "tailwind-variants";

type Props = Readonly<{
  children: React.ReactNode;
  description?: string;
  title: string;
  variant?: "base" | "compact" | "featured";
}>;

const board = tv({
  variants: {
    variant: {
      base: "space-y-4",
      compact: "",
      featured: "py-12 relative",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

export default function Board({
  children,
  description,
  title,
  variant = "base",
}: Props) {
  return (
    <section className={board({ variant })}>
      {variant === "base" ? (
        <h3 className="font-semibold px-8 uppercase">{title}</h3>
      ) : (
        <header className="text-center space-y-2 mb-8">
          <h3 className="font-bold text-2xl">{title}</h3>
          {description && <p className="text-lg">{description}</p>}
        </header>
      )}

      {children}

      {variant === "featured" && (
        <div className="absolute inset-0 bg-gradient-to-b via-blue-800 to-background to-90% opacity-10 -z-1" />
      )}
    </section>
  );
}
