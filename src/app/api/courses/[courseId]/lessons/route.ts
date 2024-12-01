// Path: /src/app/api/courses/[courseId]/lessons/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Get all lessons for a course
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const lessons = await db.lesson.findMany({
      where: {
        courseId: params.courseId
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        quiz: {
          include: {
            questions: true
          }
        }
      }
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error("[LESSONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Create a new lesson
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description, content, videoUrl } = await req.json()

    // Validate required fields
    if (!title || !description || !content) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Get current highest order
    const lessonsCount = await db.lesson.count({
      where: {
        courseId: params.courseId
      }
    })

    // Create the lesson
    const lesson = await db.lesson.create({
      data: {
        title,
        description,
        content,
        videoUrl,
        courseId: params.courseId,
        order: lessonsCount // This will place the new lesson at the end
      }
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("[LESSON_CREATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Update lesson order (for drag and drop reordering)
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { lessons } = await req.json()

    // Update all lessons with their new order
    for (const lesson of lessons) {
      await db.lesson.update({
        where: {
          id: lesson.id,
          courseId: params.courseId
        },
        data: {
          order: lesson.order
        }
      })
    }

    return new NextResponse("Success", { status: 200 })
  } catch (error) {
    console.error("[LESSONS_REORDER]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}