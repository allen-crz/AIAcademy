// Path: /src/app/(dashboard)/dashboard/page.tsx
import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { 
  GraduationCap, 
  Trophy, 
  Clock, 
  LineChart 
} from "lucide-react"

import { authOptions } from "@/lib/auth"
import { getDashboardData } from "@/lib/user"
import { CourseCard } from "@/components/course/course-card"
import { OverviewCard } from "@/components/dashboard/overview-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Course } from "@/types"

interface DashboardData {
  totalCourses: number
  completedCourses: number
  hoursSpent: number
  averageScore: number
  recentCourses: Course[]
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const {
    totalCourses,
    completedCourses,
    hoursSpent,
    averageScore,
    recentCourses
  }: DashboardData = await getDashboardData(session.user.id)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your learning progress.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Enrolled Courses"
          value={totalCourses}
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Completed Courses"
          value={completedCourses}
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Hours Spent"
          value={hoursSpent}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <OverviewCard
          title="Average Score"
          value={`${averageScore}%`}
          icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Suspense 
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Add CourseCard skeletons here */}
          </div>
        }
      >
        {recentCourses.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Recent Courses</h3>
              <Link href="/courses">
                <Button variant="ghost" className="text-sm">
                  View all courses
                  <GraduationCap className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  imageUrl={course.imageUrl}
                  progress={
                    (course.progress?.filter((p) => p.completed).length || 0) / 
                    (course.lessons?.length || 1) * 100
                  }
                  totalLessons={course.lessons?.length || 0}
                  completedLessons={course.progress?.filter((p) => p.completed).length || 0}
                  badges={course.badges || []}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <GraduationCap className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Get Started Learning</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven't enrolled in any courses yet. 
                  Explore our catalog and start your learning journey today.
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
      </Suspense>
    </div>
  )
}