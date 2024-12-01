// Path: /src/components/course/course-mobile-sidebar.tsx
"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CourseSidebar } from "./course-sidebar"

interface CourseMobileSidebarProps {
  course: any
  progressCount: number
  userProgress: {
    lessonId: string
    completed: boolean
  }[]
}

export function CourseMobileSidebar({
  course,
  progressCount,
  userProgress
}: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
          userProgress={userProgress}
        />
      </SheetContent>
    </Sheet>
  )
}