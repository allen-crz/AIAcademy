// src/components/analytics/quiz-scores-chart.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface QuizScoresChartProps {
  quizResults: {
    score: number
    createdAt: Date
    quiz: {
      title: string
      lesson: {
        title: string
      }
    }
  }[]
}

export function QuizScoresChart({ quizResults }: QuizScoresChartProps) {
  const data = quizResults.map(result => ({
    name: result.quiz.lesson.title,
    score: result.score
  })).reverse()

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Quiz Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}