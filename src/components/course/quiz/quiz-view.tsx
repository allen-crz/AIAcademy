// Path: /src/components/course/quiz/quiz-view.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { QuizResults } from "./quiz-results"

interface QuizViewProps {
  quizId: string
  courseId: string
  lessonId: string
  title: string
  questions: {
    id: string
    content: string
    options: string[]
    correctOption: number
  }[]
}

type QuizState = "taking" | "completed"

export function QuizView({
  quizId,
  courseId,
  lessonId,
  title,
  questions
}: QuizViewProps) {
  const router = useRouter()
  const [state, setState] = useState<QuizState>("taking")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<{
    score: number
    correctAnswers: number
  } | null>(null)

  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = answers[currentQuestion] !== -1

  const handleNext = () => {
    if (canProceed && !isLastQuestion) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const calculateResults = () => {
    const correctAnswers = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctOption ? 1 : 0)
    }, 0)
    
    return {
      score: Math.round((correctAnswers / questions.length) * 100),
      correctAnswers
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      const results = calculateResults()

      const response = await fetch(`/api/quiz/${quizId}/attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: results.score,
          answers
        })
      })

      if (!response.ok) {
        throw new Error("Failed to submit quiz")
      }

      setResults(results)
      setState("completed")
      toast.success('Quiz completed!')
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(questions.length).fill(-1))
    setState("taking")
    setResults(null)
  }

  if (state === "completed" && results) {
    return (
      <QuizResults
        score={results.score}
        totalQuestions={questions.length}
        correctAnswers={results.correctAnswers}
        showRetry={true}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <Card>
      {/* Rest of the quiz taking UI remains the same */}
    </Card>
  )
}