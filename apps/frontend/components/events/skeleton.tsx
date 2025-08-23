import { Skeleton } from "../ui/skeleton";

export default function EventsSkeleton() {
  return (
    <div className="space-y-12">
      <div className="px-8">
        <div className="grid lg:grid-cols-4 gap-12">{Array.from({ length: 20 }).map((_, index) => (
          <div className="flex flex-col gap-y-4" key={index}>
            <div className="aspect-video w-full">
              <Skeleton className="object-fill size-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}
