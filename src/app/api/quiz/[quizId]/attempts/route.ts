// Path: /src/app/api/quiz/[quizId]/attempts/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Get attempts for a quiz
export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const attempts = await db.quizResult.findMany({
      where: {
        quizId: params.quizId,
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(attempts)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Submit a new attempt
export async function POST(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { score } = await req.json()

    const attempt = await db.quizResult.create({
      data: {
        quizId: params.quizId,
        userId: session.user.id,
        score,
        completed: true
      }
    })

    return NextResponse.json(attempt)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}