// src/app/api/upload/route.ts
import { writeFile } from "fs/promises"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const path = `./public/uploads/${file.name}`
    await writeFile(path, buffer)

    return NextResponse.json({ url: `/uploads/${file.name}` })
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
}