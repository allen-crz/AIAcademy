// Path: /src/app/api/quiz-results/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { quizId, score } = await req.json()

    const quizResult = await db.quizResult.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        completed: true
      }
    })

    return NextResponse.json(quizResult)
  } catch (error) {
    console.log("[QUIZ_RESULT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}