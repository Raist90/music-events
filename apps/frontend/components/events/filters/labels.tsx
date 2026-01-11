"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = Readonly<{
  handleSelect: (option: Option) => void;
  options: Option[];
  selected: Option;
}>;

const { t } = translate("it");

export default function Labels({ options, selected, handleSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex gap-2 justify-between text-xs font-semibold">
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            className={cn(
              option.value === selected.value && "text-blue-300",
              "bg-input/50 rounded py-1 px-2 flex items-center",
            )}
            key={option.value}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        className="bg-input/50 rounded py-1 px-2 items-center shrink-0 size-fit"
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.delete("city");
          params.delete("countryCode");
          params.delete("endDateTime");
          params.delete("startDateTime");
          params.set("page", "0");
          router.push(`/search?${params.toString()}`, { scroll: false });
        }}
      >
        {t("navigation.filters.labels.reset")}
      </button>
    </div>
  );
}
