import { createFileRoute } from '@tanstack/react-router'

import { QuizPage } from '../features/quiz/ui/QuizPage'

export const Route = createFileRoute('/quiz')({
  component: QuizPage,
})
