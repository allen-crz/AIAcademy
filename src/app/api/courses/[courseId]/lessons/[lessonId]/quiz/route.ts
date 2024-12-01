// Path: /src/app/api/courses/[courseId]/lessons/[lessonId]/quiz/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Create a quiz for a lesson
export async function POST(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, questions } = await req.json()

    const quiz = await db.quiz.create({
      data: {
        title,
        lessonId: params.lessonId,
        questions: {
          create: questions.map((question: { 
            content: string;
            options: string[];
            correctOption: number;
          }) => ({
            content: question.content,
            options: question.options,
            correctOption: question.correctOption
          }))
        }
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.log("[QUIZ_CREATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Get quiz for a lesson
export async function GET(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quiz = await db.quiz.findUnique({
      where: {
        lessonId: params.lessonId
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.log("[QUIZ_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Update a quiz
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, questions } = await req.json()

    // First delete existing questions
    await db.question.deleteMany({
      where: {
        quiz: {
          lessonId: params.lessonId
        }
      }
    })

    // Update quiz and create new questions
    const quiz = await db.quiz.update({
      where: {
        lessonId: params.lessonId
      },
      data: {
        title,
        questions: {
          create: questions.map((question: {
            content: string;
            options: string[];
            correctOption: number;
          }) => ({
            content: question.content,
            options: question.options,
            correctOption: question.correctOption
          }))
        }
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json(quiz)
  } catch (error) {
    console.log("[QUIZ_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}