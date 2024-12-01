// Path: /src/components/course/quiz/quiz-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from "lucide-react"
import { toast } from "sonner"

interface QuizFormProps {
  courseId: string
  lessonId: string
  initialData?: {
    id?: string
    title: string
    questions: {
      content: string
      options: string[]
      correctOption: number
    }[]
  }
}

export function QuizForm({ courseId, lessonId, initialData }: QuizFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(initialData?.title || "")
  const [questions, setQuestions] = useState(
    initialData?.questions || [
      {
        content: "",
        options: ["", "", "", ""],
        correctOption: 0
      }
    ]
  )

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: "",
        options: ["", "", "", ""],
        correctOption: 0
      }
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    }
    setQuestions(newQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!title) {
        toast.error("Please add a title for the quiz")
        return
      }

      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].content) {
          toast.error(`Question ${i + 1} is missing content`)
          return
        }
        for (let j = 0; j < questions[i].options.length; j++) {
          if (!questions[i].options[j]) {
            toast.error(`Question ${i + 1} is missing option ${j + 1}`)
            return
          }
        }
      }

      const url = `/api/courses/${courseId}/lessons/${lessonId}/quiz`

      const response = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          questions
        })
      })

      if (!response.ok) {
        throw new Error("Failed to save quiz")
      }

      toast.success(initialData ? "Quiz updated" : "Quiz created")
      router.push(`/dashboard/courses/${courseId}/lessons/${lessonId}`)
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Quiz" : "Create Quiz"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Quiz Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title"
          />
        </div>

        {questions.map((question, questionIndex) => (
          <Card key={questionIndex} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Question {questionIndex + 1}</Label>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Input
                value={question.content}
                onChange={(e) => updateQuestion(questionIndex, "content", e.target.value)}
                placeholder="Enter question"
              />

              <RadioGroup
                value={question.correctOption.toString()}
                onValueChange={(value) => updateQuestion(questionIndex, "correctOption", parseInt(value))}
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-o${optionIndex}`} />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : (initialData ? "Update Quiz" : "Create Quiz")}
        </Button>
      </CardContent>
    </Card>
  )
}