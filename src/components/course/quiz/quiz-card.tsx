// Path: /src/components/course/quiz/quiz-card.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { QuizResults } from "./quiz-results"
import { useQuizState } from "@/hooks/use-quiz-state"

interface QuizCardProps {
  quizId: string
  lessonId: string
  questions: {
    id: string
    content: string
    options: string[]
    correctOption: number
  }[]
  onComplete: () => void
}

export function QuizCard({
  quizId,
  lessonId,
  questions,
  onComplete
}: QuizCardProps) {
  const { savedState, saveState, clearState } = useQuizState(quizId)
  const [currentQuestion, setCurrentQuestion] = useState(() => 
    savedState?.currentQuestion || 0
  )
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(() => 
    savedState?.answers || []
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestionData = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  // Save state when answers or current question changes
  useEffect(() => {
    if (!showResults) {
      saveState(selectedAnswers, currentQuestion)
    }
  }, [selectedAnswers, currentQuestion, showResults, saveState])

  const handleNext = () => {
    if (!selectedAnswers[currentQuestion]) {
      toast.error("Please select an answer")
      return
    }
    setCurrentQuestion(prev => prev + 1)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const correctAnswers = questions.reduce((acc, q, index) => {
        return acc + (q.correctOption === selectedAnswers[index] ? 1 : 0)
      }, 0)

      setScore(correctAnswers)

      const response = await fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          score: (correctAnswers / questions.length) * 100
        })
      })

      if (!response.ok) throw new Error()

      clearState() // Clear saved state after successful submission
      setShowResults(true)
      onComplete()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    clearState()
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setScore(0)
  }

  if (showResults) {
    return (
      <QuizResults
        score={score}
        total={questions.length}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg font-medium">
            {currentQuestionData.content}
          </p>
          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString()}
            onValueChange={(value) => {
              const newAnswers = [...selectedAnswers]
              newAnswers[currentQuestion] = parseInt(value)
              setSelectedAnswers(newAnswers)
            }}
          >
            {currentQuestionData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        {isLastQuestion ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="w-full"
          >
            Next Question
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}