// src/app/api/courses/[courseId]/enroll/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// src/app/api/courses/[courseId]/enroll/route.ts
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Update the user's enrolled courses
    await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        enrolledCourses: {
          connect: {
            id: params.courseId
          }
        }
      }
    })

    return NextResponse.json({
      message: "Enrolled successfully"
    })
  } catch (error) {
    console.log("[ENROLL]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}