// src/app/(dashboard)/analytics/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { QuizScoresChart } from "@/components/analytics/quiz-scores-chart"
import { LessonCompletionCard } from "@/components/analytics/lesson-completion-card"
import { ProgressOverview } from "@/components/analytics/progress-overview"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/")

  // Fetch user's quiz results with proper typing
  const quizResults = await db.quizResult.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      quiz: {
        include: {
          lesson: {
            select: {
              title: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Fetch user's lesson progress with proper typing
  const lessonProgress = await db.progress.findMany({
    where: {
      userId: session.user.id,
      completed: true
    },
    include: {
      lesson: {
        include: {
          course: {
            select: {
              title: true
            }
          }
        }
      }
    },
    orderBy: {
      completedAt: 'desc'
    }
  })

  const totalQuizzes = quizResults.length
  const averageScore = quizResults.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes || 0
  const completedLessons = lessonProgress.length

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground">Track your learning progress and quiz performance</p>
      </div>

      <ProgressOverview
        totalQuizzes={totalQuizzes}
        averageScore={averageScore}
        completedLessons={completedLessons}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <QuizScoresChart 
          quizResults={quizResults.map(result => ({
            score: result.score,
            createdAt: result.createdAt,
            quiz: {
              title: result.quiz.title,
              lesson: {
                title: result.quiz.lesson.title
              }
            }
          }))}
        />
        <LessonCompletionCard 
          lessonProgress={lessonProgress.map(progress => ({
            completedAt: progress.completedAt || new Date(),
            lesson: {
              title: progress.lesson.title,
              course: {
                title: progress.lesson.course.title
              }
            }
          }))}
        />
      </div>
    </div>
  )
}