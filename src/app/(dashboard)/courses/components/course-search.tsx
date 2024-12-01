// Path: /src/app/(dashboard)/courses/components/course-search.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export function CourseSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("search") || "")
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedValue) {
      params.set("search", debouncedValue)
    } else {
      params.delete("search")
    }
    router.push(`/courses?${params.toString()}`)
  }, [debouncedValue, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search courses..."
        className="w-full min-w-[200px] pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}