// Path: /src/app/api/courses/[courseId]/enroll/route.ts
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

    const course = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        students: {
          connect: {
            id: session.user.id
          }
        }
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_ENROLL]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}