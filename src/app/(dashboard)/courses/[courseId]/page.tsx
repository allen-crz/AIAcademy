// src/app/(dashboard)/courses/[courseId]/page.tsx
import Link from "next/link"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CourseHeader } from "@/components/course/course-header"
import { CourseSidebar } from "@/components/course/course-sidebar"
import { CourseMobileSidebar } from "@/components/course/course-mobile-sidebar"
import { EnrollButton } from "@/components/course/enroll-button"
import { CheckCircle } from "lucide-react"

interface CoursePageProps {
 params: {
   courseId: string
 }
}

async function getCourse(courseId: string, userId: string) {
 const course = await db.course.findUnique({
   where: { id: courseId },
   include: {
     lessons: {
       orderBy: {
         order: 'asc'
       },
       include: {
         progress: {
           where: {
             userId
           }
         }
       }
     },
     progress: {
       where: { userId }
     },
     students: true,
   }
 });

 return course;
}

export default async function CoursePage({ params }: CoursePageProps) {
 const session = await getServerSession(authOptions)
 if (!session?.user?.id) return redirect("/")

 const courseId = decodeURIComponent(params.courseId);
 const course = await getCourse(courseId, session.user.id)
 
 if (!course) return redirect("/")

 const progressCount = course.lessons.filter(
   lesson => lesson.progress.some(p => p.completed)
 ).length
 
 const isEnrolled = course.students.some(student => student.id === session.user.id) || 
                    course.studentIds?.includes(session.user.id)

 return (
   <div className="h-full">
     <div className="hidden md:block">
       <CourseSidebar 
         course={course}
         progressCount={progressCount}
       />
     </div>
     <div className="md:pl-80 h-full">
       <div className="px-6 py-16">
         <div className="flex items-center md:hidden mb-4">
           <CourseMobileSidebar 
             course={course}
             progressCount={progressCount}
           />
         </div>
         {!isEnrolled ? (
           <div className="flex flex-col items-center justify-center h-full">
             <h2 className="text-2xl font-bold mb-2">Join this course</h2>
             <p className="text-muted-foreground text-sm mb-4">
               Enroll now to start learning
             </p>
             <EnrollButton courseId={course.id} isEnrolled={isEnrolled} />
           </div>
         ) : (
           <div className="space-y-4">
             <h2 className="text-2xl font-bold">Course Content</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {course.lessons.map((lesson) => (
                 <Link 
                   key={lesson.id}
                   href={`/courses/${course.id}/lessons/${lesson.id}`}
                 >
                   <div className="p-4 border rounded-lg hover:shadow-md transition relative">
                     {lesson.progress.some(p => p.completed) && (
                       <div className="absolute top-2 right-2 text-green-500">
                         <CheckCircle className="h-4 w-4" />
                       </div>
                     )}
                     <h3 className="font-semibold">{lesson.title}</h3>
                     <p className="text-sm text-muted-foreground">
                       {lesson.description}
                     </p>
                   </div>
                 </Link>
               ))}
             </div>
           </div>
         )}
       </div>
     </div>
   </div>
 )
}