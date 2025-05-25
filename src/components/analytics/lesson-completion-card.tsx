// src/components/analytics/lesson-completion-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface LessonCompletionCardProps {
  lessonProgress: {
    completedAt: Date
    lesson: {
      title: string
      course: {
        title: string
      }
    }
  }[]
}

export function LessonCompletionCard({ lessonProgress }: LessonCompletionCardProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Completions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lessonProgress.slice(0, 5).map((progress, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded-lg"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{progress.lesson.title}</p>
              <p className="text-xs text-muted-foreground">{progress.lesson.course.title}</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}