"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function CreateFullCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Programming",
    lessons: [
      {
        title: "",
        description: "",
        content: "",
        videoFile: undefined as File | undefined,
        quiz: {
          questions: [
            {
              content: "",
              options: ["", "", "", ""],
              correctOption: 0
            }
          ]
        }
      }
    ]
  })

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Course Details</h2>
            <Input
              placeholder="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Lessons</h2>
            {formData.lessons.map((lesson, lessonIndex) => (
              <Card key={lessonIndex} className="p-4 space-y-4">
                <Input
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => {
                    const newLessons = [...formData.lessons]
                    newLessons[lessonIndex].title = e.target.value
                    setFormData({ ...formData, lessons: newLessons })
                  }}
                />
                <Textarea
                  placeholder="Lesson Description"
                  value={lesson.description}
                  onChange={(e) => {
                    const newLessons = [...formData.lessons]
                    newLessons[lessonIndex].description = e.target.value
                    setFormData({ ...formData, lessons: newLessons })
                  }}
                />
                <Textarea
                  placeholder="Lesson Content (for text lessons)"
                  value={lesson.content}
                  onChange={(e) => {
                    const newLessons = [...formData.lessons]
                    newLessons[lessonIndex].content = e.target.value
                    setFormData({ ...formData, lessons: newLessons })
                  }}
                />
                <div>
                  <p className="mb-2 text-sm">Or upload video</p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const newLessons = [...formData.lessons]
                      newLessons[lessonIndex].videoFile = e.target.files?.[0]
                      setFormData({ ...formData, lessons: newLessons })
                    }}
                  />
                </div>

                <h3 className="text-lg font-semibold">Quiz</h3>
                {lesson.quiz.questions.map((question, qIndex) => (
                  <Card key={qIndex} className="p-4 space-y-4">
                    <Input
                      placeholder="Question"
                      value={question.content}
                      onChange={(e) => {
                        const newLessons = [...formData.lessons]
                        newLessons[lessonIndex].quiz.questions[qIndex].content = e.target.value
                        setFormData({ ...formData, lessons: newLessons })
                      }}
                    />
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-2">
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newLessons = [...formData.lessons]
                            newLessons[lessonIndex].quiz.questions[qIndex].options[oIndex] = e.target.value
                            setFormData({ ...formData, lessons: newLessons })
                          }}
                        />
                        <Button
                          type="button"
                          variant={question.correctOption === oIndex ? "default" : "outline"}
                          onClick={() => {
                            const newLessons = [...formData.lessons]
                            newLessons[lessonIndex].quiz.questions[qIndex].correctOption = oIndex
                            setFormData({ ...formData, lessons: newLessons })
                          }}
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </Card>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    const newLessons = [...formData.lessons]
                    newLessons[lessonIndex].quiz.questions.push({
                      content: "",
                      options: ["", "", "", ""],
                      correctOption: 0
                    })
                    setFormData({ ...formData, lessons: newLessons })
                  }}
                >
                  Add Question
                </Button>
              </Card>
            ))}
            <Button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  lessons: [
                    ...formData.lessons,
                    {
                      title: "",
                      description: "",
                      content: "",
                      videoFile: undefined,
                      quiz: {
                        questions: [
                          {
                            content: "",
                            options: ["", "", "", ""],
                            correctOption: 0
                          }
                        ]
                      }
                    }
                  ]
                })
              }}
            >
              Add Lesson
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const handleSubmit = async () => {
    try {
      // Ensure course data is valid
      if (!formData.title || !formData.description || !formData.category) {
        toast.error("Please fill in all course details")
        return
      }

      const courseResponse = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category
        })
      })

      if (!courseResponse.ok) {
        const error = await courseResponse.text()
        console.error("Failed to create course:", error)
        throw new Error("Course creation failed")
      }

      const course = await courseResponse.json()

      await Promise.all(
        formData.lessons.map(async (lesson, index) => {
          const lessonResponse = await fetch(`/api/courses/${course.id}/lessons`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: lesson.title,
              description: lesson.description,
              content: lesson.content,
              order: index
            })
          })

          if (!lessonResponse.ok) {
            const error = await lessonResponse.text()
            console.error("Failed to create lesson:", error)
            throw new Error("Lesson creation failed")
          }

          const createdLesson = await lessonResponse.json()

          if (lesson.quiz.questions.length > 0) {
            const quizResponse = await fetch(`/api/courses/${course.id}/lessons/${createdLesson.id}/quiz`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: "Lesson Quiz",
                questions: lesson.quiz.questions
              })
            })

            if (!quizResponse.ok) {
              const error = await quizResponse.text()
              console.error("Failed to create quiz:", error)
              throw new Error("Quiz creation failed")
            }
          }
        })
      )

      toast.success("Course created successfully")
      router.push(`/courses/${course.id}`)
    } catch (error: any) {
      console.error("Error during course creation:", error)
      toast.error(`Error: ${error.message || "Something went wrong"}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6">
        {renderStep()}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}

          <Button
            onClick={() => {
              if (step < 3) setStep(step + 1)
              else handleSubmit()
            }}
          >
            {step === 3 ? "Create Course" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
