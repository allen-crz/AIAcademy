"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Course {
  id: string
  title: string
  lessons: {
    id: string
    title: string
    progress: {
      completed: boolean
    }[]
  }[]
}

interface CourseSidebarProps {
  course: Course
  progressCount: number
}

export function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const params = useParams()

  return (
    <div className="h-full border-r flex flex-col bg-background fixed w-80">
      <div className="p-8 border-b">
        <h2 className="font-semibold">{course.title}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {progressCount}/{course.lessons.length} lessons completed
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {course.lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/courses/${course.id}/lessons/${lesson.id}`}
            className={cn(
              "flex items-center gap-2 text-sm font-medium p-4 hover:bg-muted/50 transition-colors",
              lesson.progress?.[0]?.completed && "text-green-500",
              params.lessonId === lesson.id && "bg-muted"
            )}
          >
            {lesson.progress?.[0]?.completed ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            <span>Lesson {index + 1}: {lesson.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}