import { ListFilter, Menu, Search } from "lucide-react";
import Link from "next/link";

export default function MobileMenuSkeleton() {
  return (
    <div className="lg:hidden sticky w-full top-0 z-1 bg-background/85 backdrop-blur-md">
      <div className="flex gap-3 items-center justify-between border-b border-input p-4">
        <div className="flex flex-1 gap-3 items-center">
          <div className="cursor-pointer">
            <Menu size={20} />
          </div>
        </div>

        <div className="flex-2 text-center">
          <Link href="/">
            <h1 className="font-bold">LOGO</h1>
          </Link>
        </div>

        <div className="flex flex-1 gap-3 items-center justify-end">
          <div className="cursor-pointer">
            <Search size={20} />
          </div>

          <ListFilter size={20} />
        </div>
      </div>
    </div>
  );
}
