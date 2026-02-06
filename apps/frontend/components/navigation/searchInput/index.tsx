"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebounce } from "rooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serializeSearchParams } from "@/lib/events/serializeSearchParams";
import { translate } from "@/lib/translate";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("keyword") || "");
  const debouncedHandleSearch = useDebounce(handleSearch, 500);

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "0");

    const url = serializeSearchParams(`/search?${params.toString()}`, {
      keyword: query || null,
    });
    router.push(url, { scroll: false });
  }

  const { t } = translate("it");
  return (
    <>
      {/* DESKTOP */}
      <Label
        htmlFor="search"
        className="hidden lg:block border border-input dark:bg-input/30 focus-within:border-white w-72 h-9.5"
      >
        <Input
          autoComplete="off"
          autoFocus={query.length > 0}
          className="w-full border-none py-0 dark:bg-transparent focus-visible:ring-0 text-sm"
          type="text"
          name="search"
          id="search"
          placeholder={t("navigation.search_placeholder")}
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
