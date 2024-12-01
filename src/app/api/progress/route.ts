// Path: /src/app/api/progress/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(req: Request) {
  try {
    const { lessonId, courseId, userId } = await req.json()

    // First try to find an existing progress
    const existingProgress = await db.progress.findFirst({
      where: {
        userId: userId,
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
          completed: true,
          completedAt: new Date()
        }
      })
      return NextResponse.json(progress)
    }

    // If doesn't exist, create it
    const progress = await db.progress.create({
      data: {
        userId,
        courseId,
        lessonId,
        completed: true,
        completedAt: new Date()
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.log("[PROGRESS]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}