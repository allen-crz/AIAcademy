// Path: /src/components/course/course-sidebar.tsx
"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Book, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CourseSidebarProps {
  course: {
    id: string
    title: string
    description: string
    lessons: {
      id: string
      title: string
      description: string
      order: number
    }[]
  }
  progressCount: number
  userProgress: {
    lessonId: string
    completed: boolean
  }[]
}

export function CourseSidebar({ 
  course,
  progressCount,
  userProgress 
}: CourseSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={cn(
      "h-full border-r flex flex-col overflow-y-auto shadow-sm",
      "w-80 fixed left-0 top-0 dark:bg-black"
    )}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
        <p className="text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex items-center gap-x-2">
          <div className="text-sm text-muted-foreground">
            {progressCount}/{course.lessons.length} lessons completed
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        {course.lessons.map((lesson) => {
          const isActive = pathname === `/courses/${course.id}/lessons/${lesson.id}`
          const isCompleted = userProgress.find(
            (progress) => progress.lessonId === lesson.id && progress.completed
          )

          return (
            <Button
              key={lesson.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "flex items-center justify-between rounded-none text-start pl-6 font-normal relative",
                isActive && "dark:bg-secondary/10",
                isCompleted && "text-muted-foreground"
              )}
              onClick={() => router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
            >
              <div className="flex items-center gap-x-2 flex-1">
                <Book className="h-4 w-4" />
                <span className="truncate">{lesson.title}</span>
              </div>
              {isCompleted && (
                <div className="absolute right-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}