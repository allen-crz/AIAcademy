"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Quiz } from "@/components/course/quiz"
import { toast } from "sonner"

interface Question {
  id: string
  content: string
  options: string[]
  correctOption: number
}

interface Quiz {
  id: string
  title: string
  questions: Question[]
}

interface LessonViewerProps {
  courseId: string
  lessonId: string
  title: string
  description: string
  content: string
  videoUrl?: string | null
  nextLessonId?: string
  prevLessonId?: string
  progress?: {
    id: string
    completed: boolean
  } | null
  quiz?: Quiz | null
}

export function LessonViewer({
  courseId,
  lessonId,
  title,
  description,
  content,
  videoUrl,
  nextLessonId,
  prevLessonId,
  progress,
  quiz
}: LessonViewerProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const navigateToLesson = (id: string) => {
    router.push(`/courses/${courseId}/lessons/${id}`)
  }

  const handleComplete = async () => {
    try {
      if (quiz && !quizCompleted) {
        toast.error("Please complete the quiz first")
        return
      }

      setIsSubmitting(true)
      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          isCompleted: true
        })
      })

      if (!response.ok) {
        throw new Error()
      }

      toast.success("Progress updated!")
      router.refresh()

      if (nextLessonId) {
        router.push(`/courses/${courseId}/lessons/${nextLessonId}`)
      } else {
        const completionResponse = await fetch(`/api/courses/${courseId}/complete`, {
          method: "POST"
        })
        
        if (completionResponse.ok) {
          const { isCompleted } = await completionResponse.json()
          if (isCompleted) {
            toast.success("🎉 Course completed!")
            router.push(`/courses/${courseId}`)
          }
        }
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuizComplete = async (score: number) => {
    try {
      if (!quiz?.id) return

      const response = await fetch("/api/quiz-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quizId: quiz.id,
          score
        })
      })

      if (!response.ok) {
        throw new Error()
      }

      setQuizCompleted(true)
      toast.success(`Quiz completed with score: ${score}%`)
    } catch {
      toast.error("Failed to save quiz results")
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {videoUrl && (
          <div className="relative aspect-video">
            <video 
              src={videoUrl}
              controls
              className="w-full rounded-md"
            />
          </div>
        )}
        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>
        {quiz && (
          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">{quiz.title || "Lesson Quiz"}</h3>
            <Quiz
              quizId={quiz.id}
              questions={quiz.questions}
              onComplete={handleQuizComplete}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {prevLessonId && (
            <Button
              variant="outline"
              onClick={() => navigateToLesson(prevLessonId)}
              type="button"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {!progress?.completed && (
            <Button 
              onClick={handleComplete}
              disabled={Boolean(isSubmitting || (quiz && !quizCompleted))}
              type="button"
            >
              {isSubmitting ? "Updating..." : "Mark as Complete"}
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
          {nextLessonId && progress?.completed && (
            <Button
              onClick={() => navigateToLesson(nextLessonId)}
              type="button"
            >
              Next Lesson
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}