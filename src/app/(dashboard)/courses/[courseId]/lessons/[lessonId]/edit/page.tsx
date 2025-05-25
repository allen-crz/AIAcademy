// Path: /src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/edit/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { LessonForm } from "@/components/course/lesson-form"

interface EditLessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function EditLessonPage({ params }: EditLessonPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return redirect("/")
  }

  // Fetch the lesson without type assertions
  const lesson = await db.lesson.findUnique({
    where: {
      id: params.lessonId,
      courseId: params.courseId
    }
  })

  if (!lesson) {
    return redirect("/")
  }

  // Extract only the fields we need for the form
  const lessonData = {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    videoUrl: lesson.videoUrl || "",
    courseId: lesson.courseId,
    order: lesson.order
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
      <LessonForm 
        courseId={params.courseId}
        initialData={lessonData}
      />
    </div>
  )
}