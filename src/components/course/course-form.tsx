// src/components/course/course-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"

type FormState = {
  title: string
  description: string
  category: string
  lessons: {
    title: string
    description: string
    content: string
    quiz?: {
      title: string
      questions: {
        content: string
        options: string[]
        correctOption: number
      }[]
    }
  }[]
}

export function CourseForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    category: "Programming",
    lessons: []
  })

  const addLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, {
        title: "",
        description: "",
        content: ""
      }]
    }))
  }

  const updateLesson = (index: number, field: string, value: string) => {
    const newLessons = [...formData.lessons]
    newLessons[index] = {
      ...newLessons[index],
      [field]: value
    }
    setFormData(prev => ({ ...prev, lessons: newLessons }))
  }

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error()
      
      const course = await response.json()
      toast.success("Course created successfully")
      router.push(`/dashboard/courses/${course.id}`)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Course Title"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          <Textarea
            placeholder="Course Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          <Select
            value={formData.category}
            onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Programming", "Design", "Business"].map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Lessons</h3>
            <Button onClick={addLesson} type="button">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </div>

          {formData.lessons.map((lesson, index) => (
            <Card key={index}>
              <CardContent className="pt-6 space-y-4">
                <Input
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={e => updateLesson(index, "title", e.target.value)}
                />
                <Textarea
                  placeholder="Lesson Description"
                  value={lesson.description}
                  onChange={e => updateLesson(index, "description", e.target.value)}
                />
                <Textarea
                  placeholder="Lesson Content"
                  value={lesson.content}
                  onChange={e => updateLesson(index, "content", e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !formData.title || !formData.description}
          className="w-full"
        >
          {isSubmitting ? "Creating..." : "Create Course"}
        </Button>
      </CardContent>
    </Card>
  )
}