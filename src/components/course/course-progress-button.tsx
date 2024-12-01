// Path: /src/components/course/course-progress-button.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CourseProgressButtonProps {
  lessonId: string
  courseId: string
  userId: string
}

export function CourseProgressButton({
  lessonId,
  courseId,
  userId
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
          userId
        })
      })

      if (!response.ok) {
        throw new Error()
      }

      toast.success("Progress updated")
      router.refresh()
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
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as complete
        </>
      )}
    </Button>
  )
}