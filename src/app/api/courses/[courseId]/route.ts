import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Get a specific course
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          },
          include: {
            quiz: true
          }
        }
      }
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Update a course
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
        id: params.courseId,
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
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Delete a course
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const course = await db.course.delete({
      where: {
        id: params.courseId,
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}