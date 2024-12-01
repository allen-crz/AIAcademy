// Path: /src/components/course/course-header.tsx
"use client"

import { ArrowLeft, LayoutDashboard } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CourseHeaderProps {
  course: {
    id: string        // Add this
    title: string
    description: string
  }
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isMainPage = pathname === `/courses/${course.id}`  // Changed to exact match

  return (
    <div className="sticky top-0 bg-white dark:bg-black border-b h-20 z-50">
      <div className="flex h-full items-center px-6 gap-x-4">
        <Button
          onClick={() => router.back()}
          size="sm"
          variant="ghost"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold truncate">{course.title}</h1>
          {!isMainPage && (
            <p className="text-sm text-muted-foreground truncate">
              {course.description}
            </p>
          )}
        </div>
        <Link href="/dashboard">
          <Button size="sm" variant="ghost">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}