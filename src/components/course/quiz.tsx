// src/components/course/quiz.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

interface QuizProps {
  quizId: string
  questions: {
    id: string
    content: string
    options: string[]
    correctOption: number
  }[]
  onComplete: (score: number) => void
}

export function Quiz({ quizId, questions, onComplete }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      toast.error("Please answer all questions")
      return
    }

    let correctAnswers = 0
    questions.forEach((question) => {
      if (answers[question.id] === question.correctOption) {
        correctAnswers++
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    setSubmitted(true)

    if (finalScore >= 70) {
      onComplete(finalScore)
    } else {
      toast.error("You need to score at least 70% to complete this quiz")
    }
  }

  const handleRetry = () => {
    setSubmitted(false)
    setAnswers({})
    setScore(0)
  }

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <Card key={question.id} className="p-4">
          <div className="space-y-4">
            <p className="font-medium">{question.content}</p>
            <RadioGroup
              onValueChange={(value) => 
                setAnswers(prev => ({ ...prev, [question.id]: parseInt(value) }))
              }
              disabled={submitted}
              value={answers[question.id]?.toString()}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`${question.id}-${index}`}
                  />
                  <Label htmlFor={`${question.id}-${index}`}>
                    {option}
                  </Label>
                  {submitted && (
                    <span className={
                      index === question.correctOption
                        ? "text-green-500 ml-2"
                        : answers[question.id] === index
                          ? "text-red-500 ml-2"
                          : ""
                    }>
                      {index === question.correctOption && "✓"}
                      {answers[question.id] === index && 
                       index !== question.correctOption && "✗"}
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>
      ))}

      {!submitted ? (
        <Button onClick={handleSubmit} className="w-full">
          Submit Quiz
        </Button>
      ) : (
        <div className="space-y-4">
          <p className="text-lg font-medium text-center">
            Your Score: {score}%
          </p>
          {score < 70 && (
            <Button onClick={handleRetry} className="w-full">
              Retry Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  )
}