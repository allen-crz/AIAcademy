// Path: /src/app/(dashboard)/courses/page.tsx
import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCourses } from "@/lib/courses"
import { CourseCard } from "@/components/course/course-card"
import { CourseFilters } from "./components/course-filters"
import { CourseSearch } from "./components/course-search"

interface PageProps {
  searchParams: {
    category?: string
    search?: string
    page?: string
  }
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const { 
    category = "All", 
    search = "", 
    page = "1" 
  } = searchParams

  const { courses, totalPages, currentPage } = await getCourses({
    userId: session.user.id,
    category,
    search,
    page: parseInt(page),
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
        <CourseSearch />
      </div>

      <CourseFilters selectedCategory={category} />

      <Suspense 
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Add skeleton loading here */}
          </div>
        }
      >
        {courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl || '/course-placeholder.jpg'} // Add fallback image
                progress={
                  (course.progress?.filter((p) => p.completed).length || 0) / 
                  (course.lessons?.length || 1) * 100
                }
                totalLessons={course.lessons?.length || 0}
                completedLessons={course.progress?.filter((p) => p.completed).length || 0}
                badges={[]} // Since we don't have badges in our Course model
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No courses found. Please try a different category or search term.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  )
}