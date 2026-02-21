import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getNextQuestion } from '@/features/quiz/application/quizService'

export const Route = createFileRoute('/api/quiz/next')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url)
        const seed = Number(url.searchParams.get('seed') ?? Date.now())
        return json(getNextQuestion(seed))
      },
    },
  },
})
