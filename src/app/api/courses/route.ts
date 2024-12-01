// Path: /src/app/api/courses/route.ts
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

    const { title, description, imageUrl, category } = await req.json()

    const course = await db.course.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        studentIds: [session.user.id] // Creator is automatically enrolled
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_CREATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Path: /src/app/api/courses/[courseId]/route.ts
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description, imageUrl, category } = await req.json()

    const course = await db.course.update({
      where: {
        id: params.courseId
      },
      data: {
        title,
        description,
        imageUrl,
        category
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}