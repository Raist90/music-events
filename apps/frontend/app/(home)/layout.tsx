import { Suspense } from "react";
import Navigation from "@/components/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* FIXME: We should remove Suspense */}
      <Suspense>
        <Navigation />
      </Suspense>

      {children}
    </div>
  );
}
