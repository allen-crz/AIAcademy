"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CourseProgressButtonProps {
  lessonId: string
  courseId: string
  isCompleted: boolean
  onProgressChange: (lessonId: string, isCompleted: boolean) => void
}

export function CourseProgressButton({
  lessonId,
  courseId,
  isCompleted,
  onProgressChange
}: CourseProgressButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          isCompleted: !isCompleted // Toggle the completion status
        })
      })

      if (!response.ok) {
        throw new Error()
      }

      // Update the progress in the parent component (i.e., CourseSidebar or wherever onProgressChange is passed)
      onProgressChange(lessonId, !isCompleted)

      toast.success(isCompleted ? "Lesson marked as incomplete" : "Lesson completed!")

      // Optionally, navigate to the course page if the last lesson is marked as complete
      if (!isCompleted) {
        router.push(`/courses/${courseId}`)
      }

    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant="outline"
      className="w-full md:w-auto"
    >
      {isLoading ? (
        <>
          <XCircle className="h-4 w-4 mr-2" />
          Updating...
        </>
      ) : isCompleted ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
          Completed
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as complete
        </>
      )}
    </Button>
  )
}
