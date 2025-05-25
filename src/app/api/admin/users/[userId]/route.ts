// src/app/api/admin/users/[userId]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const currentUser = await db.user.findUnique({
      where: { id: session.user.id }
    })

    // @ts-ignore
    if (!currentUser || currentUser.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const { role } = await req.json()
    const validRoles = ["USER", "ADMIN", "INSTRUCTOR"]
    
    if (!validRoles.includes(role)) {
      return new NextResponse("Invalid role", { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: {
        // @ts-ignore
        role: role
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[USER_ROLE_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}