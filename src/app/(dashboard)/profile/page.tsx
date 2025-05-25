// src/app/(dashboard)/profile/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Trophy, Clock } from "lucide-react"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrolledCourses: true,
      progress: {
        where: {
          completed: true
        }
      },
      quizResults: true
    }
  })

  if (!user) return redirect("/")

  const totalCourses = user.enrolledCourses.length
  const completedLessons = user.progress.length
  const averageQuizScore = user.quizResults.reduce((acc, curr) => acc + curr.score, 0) / user.quizResults.length || 0

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
      title: "Average Quiz Score",
      value: `${Math.round(averageQuizScore)}%`,
      icon: Trophy
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your account settings and view your learning progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm 
            initialData={{
              name: user.name || "",
              email: user.email || "",
              image: user.image || ""
            }}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}