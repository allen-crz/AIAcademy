// Path: /src/components/course/quiz/quiz-results.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  correctAnswers: number
  showRetry?: boolean
  onRetry?: () => void
}

export function QuizResults({
  score,
  totalQuestions,
  correctAnswers,
  showRetry = false,
  onRetry
}: QuizResultsProps) {
  const isPassing = score >= 70

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quiz Results
          <Badge variant={isPassing ? "default" : "destructive"}>
            {score}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Progress value={score} className="flex-1" />
          <span className="text-sm font-medium">{score}%</span>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm">
              {correctAnswers} correct out of {totalQuestions} questions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm">
              {totalQuestions - correctAnswers} incorrect answers
            </span>
          </div>
        </div>

        {showRetry && !isPassing && onRetry && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}