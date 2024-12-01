    // Path: /src/app/(dashboard)/courses/create/page.tsx
import { CourseForm } from "@/components/course/course-form"

export default function CreateCoursePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      <CourseForm />
    </div>
  )
}