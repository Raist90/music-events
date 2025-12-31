export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="space-y-12">{children}</div>;
}
