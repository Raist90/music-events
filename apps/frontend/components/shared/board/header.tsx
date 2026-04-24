type Props = {
  children?: React.ReactNode;
  description?: string;
  title: string;
};

export default function BoardHeader({ children, description, title }: Props) {
  return (
    <div className="px-4 gap-y-4 md:px-8 pb-8 flex flex-col lg:flex-row lg:items-end justify-between">
      <header className="space-y-2">
        <h3 className="font-bold text-2xl">{title}</h3>
        {description && <p className="text-sm">{description}</p>}
      </header>

      {children}
    </div>
  );
}
