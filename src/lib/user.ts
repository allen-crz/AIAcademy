// Path: /src/lib/user.ts
import { db } from "@/lib/db"
import type { Course } from "@/types"

// Define types for Prisma data structures
interface UserProgress {
  completed: boolean
}

interface UserBadge {
  id: string
  name: string
  type: "achievement" | "progress" | "completion"
}

interface QuizResult {
  score: number
}

interface CourseWithDetails {
  id: string
  title: string
  description: string
  imageUrl: string
  lessons: { id: string }[]
  progress: UserProgress[]
  badges: UserBadge[]
}

interface UserWithCourses {
  enrolledCourses: CourseWithDetails[]
  quizResults: QuizResult[]
}

export async function getDashboardData(userId: string) {
  const userData = await db.user.findUnique({
    where: { id: userId },
    include: {
      enrolledCourses: {
        include: {
          lessons: true,
          progress: {
            where: {
              userId: userId
            }
          }
        }
      },
      quizResults: true,
    }
  }) as UserWithCourses | null

  // Calculate stats with proper typing
  const totalCourses = userData?.enrolledCourses?.length || 0
  
  const completedCourses = userData?.enrolledCourses?.filter(course => 
    course.lessons.length === course.progress.filter(p => p.completed).length
  ).length || 0
  
  const hoursSpent = userData?.enrolledCourses?.reduce((total: number, course: CourseWithDetails) => 
    total + (course.progress.filter(p => p.completed).length || 0)
  , 0) || 0
  
  const averageScore = userData?.quizResults?.length 
    ? Math.round(
        userData.quizResults.reduce((acc: number, curr: QuizResult) => acc + curr.score, 0) / 
        userData.quizResults.length
      )
    : 0

  const recentCourses = (userData?.enrolledCourses || []) as unknown as Course[]

  return {
    totalCourses,
    completedCourses,
    hoursSpent,
    averageScore,
    recentCourses: recentCourses.slice(0, 6)
  }
}