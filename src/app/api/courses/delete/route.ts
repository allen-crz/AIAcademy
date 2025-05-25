import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await db.course.deleteMany({})
    return new NextResponse("All courses deleted", { status: 200 })
  } catch (error) {
    return new NextResponse("Error deleting courses", { status: 500 })
  }
}