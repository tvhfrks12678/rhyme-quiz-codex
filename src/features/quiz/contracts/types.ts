export type QuizImage = {
  kind: 'assetKey'
  value: string
}

export type QuizChoice = {
  id: string
  text: string
}

export type QuizQuestionPublic = {
  id: string
  prompt: string
  choices: QuizChoice[]
  image: QuizImage
}

export type QuizSubmitRequest = {
  quizId: string
  selectedChoiceIds: string[]
}

export type QuizResult = {
  quizId: string
  isCorrect: boolean
  explanation: string
  questionVowels: string
  selectedChoiceVowels: string[]
  correctChoiceIds: string[]
}
