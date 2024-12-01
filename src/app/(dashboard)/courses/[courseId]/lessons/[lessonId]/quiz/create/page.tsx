// Path: /src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/quiz/create/page.tsx
import { QuizForm } from "@/components/course/quiz/quiz-form"

interface CreateQuizPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default function CreateQuizPage({ params }: CreateQuizPageProps) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>
      <QuizForm 
        courseId={params.courseId}
        lessonId={params.lessonId}
      />
    </div>
  )
}