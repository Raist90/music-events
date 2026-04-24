import { tv } from "tailwind-variants";

type Props = Readonly<{
  children: React.ReactNode;
  variant?: "base" | "featured";
}>;

const board = tv({
  variants: {
    variant: {
      base: {
        wrapper: "space-y-4",
      },
      featured: {
        wrapper: "pt-4 relative",
        overlay:
          "absolute inset-0 bg-gradient-to-b via-blue-800 to-background to-90% opacity-40 -z-1",
      },
    },
  },
  defaultVariants: {
    variant: "base",
  },
  slots: {
    wrapper: "",
    overlay: "",
  },
});

const { wrapper, overlay } = board();

export default function Board({ children, variant = "base" }: Props) {
  return (
    <section className={wrapper({ variant })}>
      {children}

      {variant === "featured" && <div className={overlay({ variant })} />}
    </section>
  );
}
