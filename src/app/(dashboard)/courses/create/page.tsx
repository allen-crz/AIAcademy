// src/app/(dashboard)/courses/create/page.tsx
import { CourseForm } from "@/components/course/course-form"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export default async function CreateCoursePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/sign-in")

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  })

  // @ts-ignore
  if (user?.role !== "ADMIN") {
    return redirect("/dashboard")
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      <CourseForm />
    </div>
  )
}