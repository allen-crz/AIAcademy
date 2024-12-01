// Path: /src/components/course/course-card.tsx
import Image from "next/image"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Trophy, BookOpen } from "lucide-react"

interface CourseCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  progress: number
  totalLessons: number
  completedLessons: number
  badges: {
    id: string
    name: string
    type: "achievement" | "progress" | "completion"
  }[]
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  progress,
  totalLessons,
  completedLessons,
  badges
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/courses/${id}`}>
        <div className="relative aspect-video">
          <Image
            src={imageUrl || "/course-placeholder.jpg"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate group-hover:text-primary">
              {title}
            </h3>
            {badges.length > 0 && (
              <Badge variant="secondary">
                <Trophy className="h-3 w-3 mr-1" />
                {badges.length}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{completedLessons}/{totalLessons} Lessons</span>
              </div>
              <span className="text-primary">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex gap-2 overflow-x-auto">
            {badges.map((badge) => (
              <Badge 
                key={badge.id}
                variant={
                  badge.type === "achievement" ? "default" :
                  badge.type === "completion" ? "secondary" : 
                  "outline"
                }
                className="whitespace-nowrap"
              >
                {badge.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}