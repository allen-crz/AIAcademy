// Path: /src/components/course/lesson-quiz-section.tsx
"use client"

import { QuizView } from "./quiz/quiz-view"
import { QuizPreview } from "./quiz/quiz-preview"
import { LessonQuizButton } from "./lesson-quiz-button"

interface LessonQuizSectionProps {
  courseId: string
  lessonId: string
  quiz?: {
    id: string
    title: string
    questions: {
      id: string
      content: string
      options: string[]
      correctOption: number
    }[]
  }
  isInstructor?: boolean
}

export function LessonQuizSection({
  courseId,
  lessonId,
  quiz,
  isInstructor
}: LessonQuizSectionProps) {
  if (!quiz) {
    return isInstructor ? (
      <LessonQuizButton
        courseId={courseId}
        lessonId={lessonId}
        hasQuiz={false}
      />
    ) : null
  }

  if (isInstructor) {
    return (
      <QuizPreview
        quizId={quiz.id}
        courseId={courseId}
        lessonId={lessonId}
        title={quiz.title}
        questions={quiz.questions}
      />
    )
  }

  return (
    <QuizView
      quizId={quiz.id}
      courseId={courseId}
      lessonId={lessonId}
      title={quiz.title}
      questions={quiz.questions}
    />
  )
}