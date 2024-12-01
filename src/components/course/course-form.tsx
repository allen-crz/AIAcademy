// Path: /src/components/course/course-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { UploadButton } from "@/components/upload-button"
import Image from "next/image"

const CATEGORIES = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Music",
  "Photography",
  "Writing"
] as const

interface CourseFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
    imageUrl?: string
    category: (typeof CATEGORIES)[number]
  }
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    category: initialData?.category || CATEGORIES[0]
  })

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!formData.title || !formData.description || !formData.category) {
        toast.error("Please fill in all required fields")
        return
      }

      const url = initialData?.id 
        ? `/api/courses/${initialData.id}`
        : "/api/courses"
      
      const response = await fetch(url, {
        method: initialData?.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to save course")
      }

      const course = await response.json()
      toast.success(initialData?.id ? "Course updated" : "Course created")
      router.push(`/dashboard/courses/${course.id}`)
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
          {initialData ? "Edit Course" : "Create New Course"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Input
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Course Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              category: value as (typeof CATEGORIES)[number] 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <UploadButton
            endpoint="courseImage"
            onUploadComplete={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
          />
          {formData.imageUrl && (
            <div className="relative aspect-video mt-2">
              <Image
                src={formData.imageUrl}
                alt="Course thumbnail"
                fill
                className="object-cover rounded-md"
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
            ? "Update Course"
            : "Create Course"
          }
        </Button>
      </CardContent>
    </Card>
  )
}