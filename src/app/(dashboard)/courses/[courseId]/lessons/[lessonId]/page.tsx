// Path: /src/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/page.tsx
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { VideoPlayer } from "@/components/course/video-player"
import { CourseProgressButton } from "@/components/course/course-progress-button"
import { LessonNavigation } from "@/components/course/lesson-navigation"
import { QuizCard } from "@/components/course/quiz/quiz-card"

interface LessonPageProps {
 params: {
   courseId: string
   lessonId: string
 }
}

async function getLesson(courseId: string, lessonId: string) {
 const lesson = await db.lesson.findUnique({
   where: {
     id: lessonId,
     courseId: courseId
   },
   include: {
     course: {
       include: {
         lessons: {
           orderBy: {
             order: 'asc'
           }
         }
       }
     },
     quiz: {
       include: {
         questions: true
       }
     }
   }
 })

 return lesson
}

export default async function LessonPage({ params }: LessonPageProps) {
 const session = await getServerSession(authOptions)
 if (!session?.user?.id) {
   return redirect("/")
 }

 const lesson = await getLesson(params.courseId, params.lessonId)

 if (!lesson) {
   return redirect(`/courses/${params.courseId}`)
 }

 const courseLessons = lesson.course.lessons
 const currentLessonIndex = courseLessons.findIndex(l => l.id === lesson.id)
 const nextLesson = courseLessons[currentLessonIndex + 1]
 const prevLesson = courseLessons[currentLessonIndex - 1]

 return (
   <div className="p-6 space-y-8">
     <div>
       <h1 className="text-2xl font-bold">{lesson.title}</h1>
       <p className="text-sm text-muted-foreground">{lesson.description}</p>
     </div>

     {lesson.videoUrl && (
       <VideoPlayer videoUrl={lesson.videoUrl} />
     )}

     <div>
       <h2 className="text-xl font-semibold mb-2">Lesson Content</h2>
       <div className="prose dark:prose-invert">
         {lesson.content}
       </div>
     </div>

     {lesson.quiz && (
       <div>
         <h2 className="text-xl font-semibold mb-4">Lesson Quiz</h2>
         <QuizCard
           quizId={lesson.quiz.id}
           lessonId={lesson.id}
           questions={lesson.quiz.questions}
           onComplete={() => {
             // We'll handle this next
           }}
         />
       </div>
     )}

     <div className="flex flex-col gap-y-4">
       <CourseProgressButton
         lessonId={lesson.id}
         courseId={params.courseId}
         userId={session.user.id}
       />
       <LessonNavigation 
         courseId={params.courseId}
         lessonId={lesson.id}
         nextLessonId={nextLesson?.id}
         prevLessonId={prevLesson?.id}
       />
     </div>
   </div>
 )
}

