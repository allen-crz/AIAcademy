// Path: /src/components/course/lesson-quiz-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface LessonQuizButtonProps {
  courseId: string
  lessonId: string
  hasQuiz?: boolean
}

export function LessonQuizButton({ courseId, lessonId, hasQuiz }: LessonQuizButtonProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Lesson Quiz</h2>
      {!hasQuiz && (
        <Button 
          onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/${lessonId}/quiz/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Quiz
        </Button>
      )}
    </div>
  )
}