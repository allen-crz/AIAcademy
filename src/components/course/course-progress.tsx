// Path: /src/components/course/course-progress.tsx
"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CourseProgressButton } from "@/components/course/course-progress-button"

interface CourseProgressProps {
  completedLessons: number
  totalLessons: number
  showPercentage?: boolean
  courseId: string
  userProgress: {
    lessonId: string
    completed: boolean
  }[]
  onProgressChange: (lessonId: string, isCompleted: boolean) => void
}

export function CourseProgress({
  completedLessons,
  totalLessons,
  showPercentage = true,
  courseId,
  userProgress,
  onProgressChange
}: CourseProgressProps) {
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center justify-between gap-2">
        <Progress value={progressPercentage} className="h-2" />
        {showPercentage && (
          <Badge variant="secondary">
            {progressPercentage}%
          </Badge>
        )}
      </div>

      {/* Progress Details */}
      <div className="text-sm text-muted-foreground">
        {completedLessons}/{totalLessons} lessons completed
      </div>

      {/* Progress Buttons */}
      <div className="space-y-2 mt-4">
        {userProgress.map((progress) => {
          const lesson = userProgress.find((p) => p.lessonId === progress.lessonId)
          return (
            <CourseProgressButton
              key={progress.lessonId}
              lessonId={progress.lessonId}
              courseId={courseId}
              isCompleted={progress.completed}
              onProgressChange={onProgressChange}
            />
          )
        })}
      </div>
    </div>
  )
}
