import type {
  QuizQuestionPublic,
  QuizResult,
  QuizSubmitRequest,
} from '../contracts/types'

export async function fetchNextQuestion() {
  const response = await fetch('/api/quiz/next')

  if (!response.ok) {
    throw new Error('Failed to fetch next quiz')
  }

  return (await response.json()) as QuizQuestionPublic
}

export async function submitQuizAnswer(payload: QuizSubmitRequest) {
  const response = await fetch('/api/quiz/submit', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to submit answer')
  }

  return (await response.json()) as QuizResult
}
