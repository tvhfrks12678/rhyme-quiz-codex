import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { submitAnswer } from '@/features/quiz/application/quizService'

export const Route = createFileRoute('/api/quiz/submit')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          quizId?: string
          selectedChoiceIds?: string[]
        }

        if (!body.quizId || !Array.isArray(body.selectedChoiceIds)) {
          return json({ message: 'Invalid request body' }, { status: 400 })
        }

        try {
          return json(
            submitAnswer({
              quizId: body.quizId,
              selectedChoiceIds: body.selectedChoiceIds,
            }),
          )
        } catch {
          return json({ message: 'Quiz not found' }, { status: 404 })
        }
      },
    },
  },
})
