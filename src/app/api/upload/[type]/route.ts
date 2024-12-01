// Path: /src/app/api/upload/[type]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(
  req: Request,
  { params }: { params: { type: "courseImage" | "lessonVideo" } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename using timestamp and original name
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
    const filename = `${timestamp}-${originalName}`;
    
    // Save to public directory
    const publicPath = path.join(process.cwd(), 'public', 'uploads');
    await writeFile(path.join(publicPath, filename), buffer);

    // Return the URL that can be used to access the file
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[FILE_UPLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}