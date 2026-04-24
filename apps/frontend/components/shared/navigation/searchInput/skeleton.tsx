import { translate } from "@/lib/translate";

export default function SearchInputSkeleton() {
  const { t } = translate("it");
  return (
    <div className="hidden lg:flex items-center h-9.5 border border-input dark:bg-input/30 w-72 px-3 text-sm text-muted-foreground font-medium">
      <p className="">{t("navigation.search_placeholder")}</p>
    </div>
  );
}
