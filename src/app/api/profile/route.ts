// src/app/api/profile/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, image } = body

    const user = await db.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name,
        image
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.log("[PROFILE_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}