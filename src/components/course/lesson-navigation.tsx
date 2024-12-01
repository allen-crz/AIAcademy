// Path: /src/components/course/lesson-navigation.tsx
"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LessonNavigationProps {
  courseId: string
  lessonId: string
  nextLessonId?: string
  prevLessonId?: string
}

export function LessonNavigation({
  courseId,
  lessonId,
  nextLessonId,
  prevLessonId,
}: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 w-full">
      {prevLessonId ? (
        <Button
          variant="ghost"
          className="flex items-center gap-x-2"
          asChild
        >
          <Link href={`/courses/${courseId}/lessons/${prevLessonId}`}>
            <ChevronLeft className="h-4 w-4" />
            Previous Lesson
          </Link>
        </Button>
      ) : (
        <div /> 
      )}
      
      {nextLessonId && (
        <Button
          variant="ghost"
          className="flex items-center gap-x-2"
          asChild
        >
          <Link href={`/courses/${courseId}/lessons/${nextLessonId}`}>
            Next Lesson
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}