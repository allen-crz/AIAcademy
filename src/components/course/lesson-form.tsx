// Path: /src/components/course/lesson-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { UploadButton } from "@/components/upload-button"

// Match the Prisma Lesson type
interface Lesson {
  id: string
  title: string
  description: string
  content: string
  videoUrl: string | null
  courseId: string
  order: number
}

interface LessonFormProps {
  courseId: string
  initialData?: Lesson
}

export function LessonForm({ courseId, initialData }: LessonFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    videoUrl: initialData?.videoUrl || ""
  })

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!formData.title || !formData.description || !formData.content) {
        toast.error("Please fill in all required fields")
        return
      }

      const url = initialData?.id
        ? `/api/courses/${courseId}/lessons/${initialData.id}`
        : `/api/courses/${courseId}/lessons`

      const response = await fetch(url, {
        method: initialData?.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to save lesson")
      }

      toast.success(initialData?.id ? "Lesson updated" : "Lesson created")
      router.push(`/dashboard/courses/${courseId}`)
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
          {initialData ? "Edit Lesson" : "Create New Lesson"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Input
            placeholder="Lesson Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Lesson Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Lesson Content (markdown supported)"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={10}
          />
        </div>

        <div className="space-y-2">
          <UploadButton
            endpoint="lessonVideo"
            onUploadComplete={(url) => setFormData(prev => ({ ...prev, videoUrl: url }))}
          />
          {formData.videoUrl && (
            <div className="relative aspect-video mt-2">
              <video
                src={formData.videoUrl}
                controls
                className="w-full rounded-md"
              />
            </div>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Lesson"
            : "Create Lesson"
          }
        </Button>
      </CardContent>
    </Card>
  )
}