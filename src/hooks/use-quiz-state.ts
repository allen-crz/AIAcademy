// Path: /src/hooks/use-quiz-state.ts
"use client"

import { useEffect, useState } from "react"

export function useQuizState(quizId: string) {
  const storageKey = `quiz_${quizId}`
  const [state, setState] = useState<{
    answers: number[]
    currentQuestion: number
  } | null>(null)

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setState(JSON.parse(saved))
    }
  }, [storageKey])

  // Save state
  const saveState = (answers: number[], currentQuestion: number) => {
    const newState = { answers, currentQuestion }
    setState(newState)
    localStorage.setItem(storageKey, JSON.stringify(newState))
  }

  // Clear state
  const clearState = () => {
    setState(null)
    localStorage.removeItem(storageKey)
  }

  return {
    savedState: state,
    saveState,
    clearState
  }
}