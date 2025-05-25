// src/app/api/test/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
 try {
   const session = await getServerSession(authOptions)
   if (!session?.user?.id) {
     return new NextResponse("Unauthorized", { status: 401 })
   }

   // Create course
   const course = await db.course.create({
     data: {
       title: "Introduction to AI",
       description: "Learn the basics of Artificial Intelligence",
       category: "Programming",
       imageUrl: "/course-placeholder.jpg",
       studentIds: [session.user.id]
     }
   })

   // Create lesson 1 (text)
   const lesson1 = await db.lesson.create({
     data: {
       title: "What is Artificial Intelligence?",
       description: "Understanding the fundamentals of AI",
       content: "AI is the simulation of human intelligence by machines. Key concepts include machine learning, neural networks, and natural language processing.",
       courseId: course.id,
       order: 0
     }
   })

   // Create lesson 2 (video)
   const lesson2 = await db.lesson.create({
     data: {
       title: "AI in Practice",
       description: "Watch AI applications in action",
       content: "Video demonstration of AI applications",
       videoUrl: "https://example.com/ai-intro.mp4",
       courseId: course.id,
       order: 1
     }
   })

   // Create quiz
   await db.quiz.create({
     data: {
       title: "AI Fundamentals Quiz",
       lessonId: lesson2.id,
       questions: {
         create: [
           {
             content: "What is AI?",
             options: ["A robot", "Intelligence simulation", "A computer", "Software"],
             correctOption: 1
           }
         ]
       }
     }
   })

   return NextResponse.json(course)
 } catch (error) {
   console.error(error)
   return new NextResponse("Error creating course", { status: 500 })
 }
}