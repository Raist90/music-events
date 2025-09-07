import Navigation from "@/components/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navigation transparent />

      {children}
    </div>
  );
}
