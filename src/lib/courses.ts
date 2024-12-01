// Path: /src/lib/courses.ts
import { db } from "@/lib/db"
import type { Prisma } from "@prisma/client"

export async function getCourses({
  userId,
  category = "All",
  search = "",
  page = 1,
  limit = 9
}: {
  userId: string
  category?: string
  search?: string
  page?: number
  limit?: number
}) {
  try {
    const skip = (page - 1) * limit

    // Build where conditions
    const whereConditions: any = {}

    // Add search condition if search is provided
    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add category condition if not "All"
    if (category !== "All") {
      whereConditions.category = category
    }

    const [courses, totalCourses] = await Promise.all([
      db.course.findMany({
        where: whereConditions,
        include: {
          lessons: true,
          progress: {
            where: {
              userId
            }
          },
          students: {
            where: {
              id: userId
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.course.count({ where: whereConditions })
    ])

    const totalPages = Math.ceil(totalCourses / limit)

    return {
      courses,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error("Error fetching courses:", error)
    throw error
  }
}