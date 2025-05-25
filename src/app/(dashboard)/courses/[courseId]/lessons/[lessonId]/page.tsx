// src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { LessonViewer } from "@/components/course/lesson-viewer"
import { CourseSidebar } from "@/components/course/course-sidebar"
import { CourseMobileSidebar } from "@/components/course/course-mobile-sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/")

  const lesson = await db.lesson.findUnique({
    where: {
      id: params.lessonId,
      courseId: params.courseId,
    },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: {
              order: 'asc'
            },
            include: {
              progress: {
                where: {
                  userId: session.user.id
                }
              }
            }
          }
        }
      },
      quiz: {
        include: {
          questions: true
        }
      }
    }
  })

  if (!lesson) return redirect("/courses")

  const userProgress = await db.progress.findUnique({
    where: {
      userId_courseId_lessonId: {
        userId: session.user.id,
        courseId: params.courseId,
        lessonId: params.lessonId
      }
    }
  })

  const progressCount = lesson.course.lessons.filter(
    lesson => lesson.progress.some(p => p.completed)
  ).length

  const currentLessonIndex = lesson.course.lessons.findIndex(l => l.id === lesson.id)
  const nextLesson = lesson.course.lessons[currentLessonIndex + 1]
  const prevLesson = lesson.course.lessons[currentLessonIndex - 1]

  return (
    <div className="h-full">
      <div className="flex h-full">
        {/* Course Sidebar */}
        <div className="hidden md:block w-80 flex-shrink-0 border-r h-full">
          <CourseSidebar
            course={lesson.course}
            progressCount={progressCount}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Back button and mobile sidebar */}
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/courses/${params.courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to course
                </Button>
              </Link>
              <div className="md:hidden">
                <CourseMobileSidebar 
                  course={lesson.course}
                  progressCount={progressCount}
                />
              </div>
            </div>

            <LessonViewer
              courseId={params.courseId}
              lessonId={params.lessonId}
              title={lesson.title}
              description={lesson.description}
              content={lesson.content}
              videoUrl={lesson.videoUrl}
              nextLessonId={nextLesson?.id}
              prevLessonId={prevLesson?.id}
              progress={userProgress}
              quiz={lesson.quiz}
            />
          </div>
        </div>
      </div>
    </div>
  )
}