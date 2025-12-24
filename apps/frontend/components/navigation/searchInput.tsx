"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { useDebounce } from "rooks";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";

type Props = Readonly<{
  handleSearch: (query: string) => void;
}>;

export default function SearchInput({ handleSearch }: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("keyword") || "");
  const debouncedHandleSearch = useDebounce(handleSearch, 250);
  return (
    <>
      {/* DESKTOP */}
      <Label
        htmlFor="search"
        className="hidden lg:block border border-input dark:bg-input/30 focus-within:border-white w-72"
      >
        <Input
          autoComplete="off"
          autoFocus={query.length > 0}
          className="w-full border-none py-0 dark:bg-transparent focus-visible:ring-0 text-sm"
          type="text"
          name="search"
          id="search"
          placeholder="Cerca eventi, artisti o generi"
          value={query}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setQuery(value);
            debouncedHandleSearch(value);
          }}
        />
      </Label>

      {/* MOBILE */}
      <Label
        htmlFor="mobile-search"
        className="lg:hidden px-2 border border-input dark:bg-input/30 focus-within:border-white"
      >
        <Input
          autoComplete="off"
          autoFocus
          className="w-full border-none dark:bg-transparent px-2 focus-visible:ring-0 text-sm"
          type="text"
          name="mobile-search"
          id="mobile-search"
          placeholder="Eventi, artisti, generi"
          value={query}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setQuery(value);
            debouncedHandleSearch(value);
          }}
        />
      </Label>
    </>
  );
}
