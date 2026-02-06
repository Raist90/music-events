"use client";

import Link from "next/link";
import { Suspense, useRef } from "react";
import MobileMenu from "./mobileMenu";
import MobileMenuSkeleton from "./mobileMenu/skeleton";
import SearchInput from "./searchInput";
import SearchInputSkeleton from "./searchInput/skeleton";

const links: Record<"href" | "label", string>[] = [
  { href: "/", label: "LOGO" },
  { href: "/search", label: "Esplora" },
];

export default function Navigation() {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={menuRef}
        className={
          "bg-background/85 backdrop-blur-md py-4 lg:flex justify-between gap-x-4 items-center px-4 md:px-8 text-sm sticky top-0 z-1 hidden border-b border-input"
        }
      >
        {links?.length && (
          <ul className="flex gap-x-4">
            {links.map(({ href, label }) => (
              <li key={href} className="hover:text-blue-300">
                <Link href={href} className="font-bold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-x-4">
          <Suspense fallback={<SearchInputSkeleton />}>
            <SearchInput />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<MobileMenuSkeleton />}>
        <MobileMenu />
      </Suspense>
    </>
  );
}
