// Path: /src/components/course/quiz/quiz-preview.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Pencil } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizPreviewProps {
  quizId: string
  courseId: string
  lessonId: string
  title: string
  questions: {
    content: string
    options: string[]
    correctOption: number
  }[]
}

export function QuizPreview({
  quizId,
  courseId,
  lessonId,
  title,
  questions
}: QuizPreviewProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary">
              {questions.length} questions
            </Badge>
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/${lessonId}/quiz/${quizId}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/${lessonId}/quiz/${quizId}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="font-medium mb-2">Question {index + 1}:</div>
              <div className="mb-2">{question.content}</div>
              <div className="space-y-1">
                {question.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className={`p-2 rounded-md ${
                      optionIndex === question.correctOption
                        ? "bg-emerald-100 dark:bg-emerald-900/20"
                        : "bg-slate-100 dark:bg-slate-900/20"
                    }`}
                  >
                    {optionIndex === question.correctOption && (
                      <Badge variant="secondary" className="mr-2">
                        Correct Answer
                      </Badge>
                    )}
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}