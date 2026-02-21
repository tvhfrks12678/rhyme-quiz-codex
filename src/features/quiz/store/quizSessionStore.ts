import { useSyncExternalStore } from 'react'

type QuizSessionState = {
  attempts: number
  correctAnswers: number
}

let state: QuizSessionState = {
  attempts: 0,
  correctAnswers: 0,
}

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) {
    listener()
  }
}

export function recordAnswer(isCorrect: boolean) {
  state = {
    attempts: state.attempts + 1,
    correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
  }
  emit()
}

export function resetSession() {
  state = { attempts: 0, correctAnswers: 0 }
  emit()
}

export function useQuizSessionStore() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
    () => state,
  )
}
