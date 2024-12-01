// Path: /src/components/course/enroll-button.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface EnrollButtonProps {
  courseId: string
  isEnrolled: boolean
}

export function EnrollButton({
  courseId,
  isEnrolled
}: EnrollButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error()
      }

      toast.success("Enrolled in course!")
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
      disabled={isLoading || isEnrolled}
      size="lg"
      className="w-full md:w-auto"
    >
      {isEnrolled ? "Already enrolled" : "Enroll in course"}
    </Button>
  )
}