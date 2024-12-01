// Path: /src/app/(dashboard)/courses/[courseId]/lessons/create/page.tsx
import { LessonForm } from "@/components/course/lesson-form"

interface CreateLessonPageProps {
  params: {
    courseId: string
  }
}

export default function CreateLessonPage({ params }: CreateLessonPageProps) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Lesson</h1>
      <LessonForm courseId={params.courseId} />
    </div>
  )
}