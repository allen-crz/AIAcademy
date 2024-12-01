// Path: /src/app/(dashboard)/courses/[courseId]/page.tsx
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CourseHeader } from "@/components/course/course-header"
import { CourseSidebar } from "@/components/course/course-sidebar"
import { CourseMobileSidebar } from "@/components/course/course-mobile-sidebar"
import { EnrollButton } from "@/components/course/enroll-button"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

async function getCourse(courseId: string, userId: string) {
  const course = await db.course.findUnique({
    where: {
      id: courseId
    },
    include: {
      lessons: {
        orderBy: {
          order: 'asc'
        }
      },
      progress: {
        where: {
          userId
        }
      },
      students: {
        where: {
          id: userId
        }
      }
    }
  })

  return course
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return redirect("/")
  }

  const course = await getCourse(params.courseId, session.user.id)

  if (!course) {
    return redirect("/")
  }

  const progressCount = course.progress.filter(
    (progress) => progress.completed
  ).length

  const userProgress = course.progress.map((progress) => ({
    lessonId: progress.lessonId,
    completed: progress.completed,
  }))

  const isEnrolled = course.students.length > 0

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <div className="p-6 flex items-center">
          <CourseMobileSidebar 
            course={course}
            progressCount={progressCount}
            userProgress={userProgress}
          />
          <CourseHeader course={course} />
        </div>
      </div>
      <div className="hidden md:block">
        <CourseSidebar 
          course={course}
          progressCount={progressCount}
          userProgress={userProgress}
        />
      </div>
      <div className="md:pl-80 pt-[80px]">
        <div className="p-6">
          {!isEnrolled ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold mb-2">
                Join this course
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Enroll now to start learning
              </p>
              <EnrollButton 
                courseId={course.id} 
                isEnrolled={isEnrolled} 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Course Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="p-4 border rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-semibold">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {lesson.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}