// Path: /src/components/course/course-loader.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function CourseLoader() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="aspect-video relative">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}