// src/app/api/courses/[courseId]/complete/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get course with lessons
    const course = await db.course.findUnique({
      where: {
        id: params.courseId
      },
      include: {
        lessons: {
          include: {
            progress: {
              where: {
                userId: session.user.id
              }
            }
          }
        }
      }
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    // Check if all lessons are completed
    const allLessonsCompleted = course.lessons.every(lesson => 
      lesson.progress.some(p => p.completed)
    )

    if (!allLessonsCompleted) {
      return NextResponse.json({ 
        error: "Complete all lessons first",
        isCompleted: false 
      }, { status: 400 })
    }

    // Create or update course progress
    await db.progress.create({
      data: {
        userId: session.user.id,
        courseId: params.courseId,
        lessonId: course.lessons[course.lessons.length - 1].id, // Use last lesson id
        completed: true,
        completedAt: new Date()
      }
    })

    return NextResponse.json({ isCompleted: true })
  } catch (error) {
    console.error("[COURSE_COMPLETION]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}