import type {
  QuizQuestionPublic,
  QuizResult,
  QuizSubmitRequest,
} from '../contracts/types'
import { judgeAnswer } from '../domain/judge'
import { quizData } from '../infra/quizData'

function toPublicQuestion(index: number): QuizQuestionPublic {
  const question = quizData[index % quizData.length]

  return {
    id: question.id,
    prompt: question.prompt,
    image: question.image,
    choices: question.choices.map((choice) => ({
      id: choice.id,
      text: choice.text,
    })),
  }
}

export function getNextQuestion(seed?: number): QuizQuestionPublic {
  const safeSeed = Number.isFinite(seed) ? Math.abs(Number(seed)) : Date.now()
  return toPublicQuestion(safeSeed)
}

export function submitAnswer(input: QuizSubmitRequest): QuizResult {
  const question = quizData.find((item) => item.id === input.quizId)

  if (!question) {
    throw new Error('Quiz not found')
  }

  const correctChoiceIds = question.choices
    .filter((choice) => choice.isCorrect)
    .map((choice) => choice.id)

  const selectedChoiceVowels = question.choices
    .filter((choice) => input.selectedChoiceIds.includes(choice.id))
    .map((choice) => choice.vowels)

  return {
    quizId: question.id,
    isCorrect: judgeAnswer(correctChoiceIds, input.selectedChoiceIds),
    explanation: question.explanation,
    questionVowels: question.questionVowels,
    selectedChoiceVowels,
    correctChoiceIds,
  }
}
