import { tv } from "tailwind-variants";

type Props = Readonly<{
  children: React.ReactNode;
  description?: string;
  title: string;
  variant?: "base" | "featured";
}>;

const board = tv({
  variants: {
    variant: {
      base: {
        wrapper: "space-y-4",
        title: "font-semibold px-8 uppercase",
      },
      featured: {
        wrapper: "pt-12 relative",
        title: "font-bold text-2xl",
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
    header: "text-center space-y-2 px-2 pb-8",
    title: "",
    overlay: "",
  },
});

const { wrapper, header, title, overlay } = board();

export default function Board({
  children,
  description,
  title: titleProp,
  variant = "base",
}: Props) {
  return (
    <section className={wrapper({ variant })}>
      <Header title={titleProp} description={description} variant={variant} />

      {children}

      {variant === "featured" && <div className={overlay({ variant })} />}
    </section>
  );
}

function Header({
  title: titleProp,
  description,
  variant,
}: Omit<Props, "children">) {
  let Header = <h3 className={title({ variant })}>{titleProp}</h3>;

  if (variant === "featured") {
    Header = (
      <header className={header({ variant })}>
        <h3 className={title({ variant })}>{titleProp}</h3>
        {description && <p>{description}</p>}
      </header>
    );
  }

  return Header;
}
