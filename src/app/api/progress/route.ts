// Path: /src/app/api/progress/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { lessonId, courseId, isCompleted } = await req.json()

    // First try to find existing progress
    const existingProgress = await db.progress.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        lessonId: lessonId,
      }
    })

    // If exists, update it
    if (existingProgress) {
      const progress = await db.progress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null
        }
      })
      return NextResponse.json(progress)
    }

    // If doesn't exist, create it
    const progress = await db.progress.create({
      data: {
        userId: session.user.id,
        courseId,
        lessonId,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.log("[PROGRESS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}