// Path: /src/components/course/course-lessons.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { GripVertical, Pencil, Plus, Trash } from "lucide-react"
import { toast } from "sonner"

interface Lesson {
  id: string
  title: string
  description: string
  order: number
}

interface CourseLessonsProps {
  courseId: string
  lessons: Lesson[]
}

export function CourseLessons({ courseId, lessons }: CourseLessonsProps) {
  const router = useRouter()

  const handleDelete = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete lesson")
      }

      toast.success("Lesson deleted")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Course Lessons</h2>
        <Button onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <p className="text-muted-foreground text-sm">No lessons yet. Create your first lesson!</p>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="p-4">
              <div className="flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <div className="flex-1">
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(lesson.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}