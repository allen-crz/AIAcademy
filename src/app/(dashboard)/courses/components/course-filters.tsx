// Path: /src/app/(dashboard)/courses/components/course-filters.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "All",
  "Programming",
  "Design",
  "Business",
  "Mathematics",
  "Science",
  "Language",
] as const

export function CourseFilters({ selectedCategory }: { selectedCategory: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category === "All") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/courses?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          className={cn(
            "whitespace-nowrap",
            selectedCategory === category && "bg-primary text-primary-foreground"
          )}
          onClick={() => handleCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}