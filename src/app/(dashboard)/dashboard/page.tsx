// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { CourseCard } from "@/components/course/course-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  GraduationCap, 
  Trophy, 
  Clock, 
  LineChart
} from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/sign-in")

  // Fetch user with all necessary relationships
  const user = await db.user.findUnique({
    where: { 
      id: session.user.id 
    },
    include: {
      enrolledCourses: {
        include: {
          lessons: {
            include: {
              progress: {
                where: {
                  userId: session.user.id
                }
              }
            }
          },
          progress: {
            where: {
              userId: session.user.id,
              completed: true
            }
          }
        }
      },
      quizResults: true,
      progress: {
        where: {
          completed: true
        }
      }
    }
  })

  if (!user) return redirect("/sign-in")

  // Calculate statistics
  const totalCourses = user.enrolledCourses.length
  const completedLessons = user.progress.length
  const averageScore = user.quizResults.length > 0
    ? Math.round(user.quizResults.reduce((acc, curr) => acc + curr.score, 0) / user.quizResults.length)
    : 0
  const hoursSpent = completedLessons * 0.5 // Assuming 30 minutes per lesson

  const stats = [
    {
      title: "Enrolled Courses",
      value: totalCourses,
      icon: GraduationCap
    },
    {
      title: "Completed Lessons",
      value: completedLessons,
      icon: Clock
    },
    {
      title: "Hours Spent",
      value: hoursSpent,
      icon: Clock
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: Trophy
    }
  ]

  // console.log("Enrolled Courses:", user.enrolledCourses) // Debug log

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your learning progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Courses</h3>
          <Link href="/courses">
            <Button variant="outline" size="sm">
              Browse all courses
            </Button>
          </Link>
        </div>

        {user.enrolledCourses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.enrolledCourses.map((course) => {
              const lessonCount = course.lessons.length;
              const completedCount = course.progress.length;
              const progressPercentage = lessonCount > 0 
                ? (completedCount / lessonCount) * 100 
                : 0;

              return (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description || ""}
                  imageUrl={course.imageUrl}
                  progress={progressPercentage}
                  totalLessons={lessonCount}
                  completedLessons={completedCount}
                  badges={[]} // Add badges if you have them
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <GraduationCap className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No courses yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven't enrolled in any courses yet. 
                  Browse our catalog and start your learning journey today.
                </p>
              </div>
              <Link href="/courses">
                <Button className="mt-4" size="lg">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}