import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  fetchNextQuestion,
  submitQuizAnswer,
} from '@/features/quiz/api-client/quizApiClient'
import type {
  QuizQuestionPublic,
  QuizResult,
} from '@/features/quiz/contracts/types'
import {
  recordAnswer,
  resetSession,
  useQuizSessionStore,
} from '@/features/quiz/store/quizSessionStore'

export const Route = createFileRoute('/quiz')({
  component: QuizPage,
})

const assetImageMap: Record<string, string> = {
  tora: '/tanstack-circle-logo.png',
  beat: '/logo512.png',
}

function QuizPage() {
  const [question, setQuestion] = useState<QuizQuestionPublic | null>(null)
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false)
  const session = useQuizSessionStore()

  const scoreLabel = useMemo(() => {
    if (session.attempts === 0) {
      return 'まだ未回答'
    }

    return `${session.correctAnswers} / ${session.attempts}`
  }, [session])

  const loadQuestion = async () => {
    setIsLoadingQuestion(true)
    const nextQuestion = await fetchNextQuestion()
    setQuestion(nextQuestion)
    setSelectedChoiceIds([])
    setResult(null)
    setIsLoadingQuestion(false)
  }

  useEffect(() => {
    loadQuestion()
  }, [])

  const toggleChoice = (choiceId: string) => {
    setSelectedChoiceIds((current) =>
      current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId],
    )
  }

  const onSubmit = async () => {
    if (!question || selectedChoiceIds.length === 0) {
      return
    }

    setIsSubmitting(true)
    const submission = await submitQuizAnswer({
      quizId: question.id,
      selectedChoiceIds,
    })
    setResult(submission)
    recordAnswer(submission.isCorrect)
    setIsSubmitting(false)
  }

  const imageSrc = question ? assetImageMap[question.image.value] : null

  return (
    <main className="mx-auto max-w-3xl p-6 text-white">
      <h2 className="text-3xl font-bold mb-3">ラップ韻クイズ</h2>
      <p className="text-gray-300 mb-6">累計スコア: {scoreLabel}</p>

      <div className="rounded-xl border border-gray-700 bg-gray-900/70 p-5 space-y-4">
        {isLoadingQuestion && <p>問題を読み込み中...</p>}

        {question && (
          <>
            <p className="text-lg font-medium">{question.prompt}</p>
            {imageSrc && (
              <img
                src={imageSrc}
                alt={question.image.value}
                className="h-44 w-full rounded-lg object-cover"
              />
            )}

            <ul className="space-y-2">
              {question.choices.map((choice) => {
                const checked = selectedChoiceIds.includes(choice.id)
                return (
                  <li key={choice.id}>
                    <label className="flex items-center gap-3 rounded-md border border-gray-700 p-3 cursor-pointer hover:bg-gray-800">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChoice(choice.id)}
                      />
                      <span>{choice.text}</span>
                    </label>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || selectedChoiceIds.length === 0}
                className="rounded bg-cyan-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
              >
                {isSubmitting ? '判定中...' : '解答する'}
              </button>
              <button
                type="button"
                onClick={loadQuestion}
                className="rounded border border-gray-500 px-4 py-2"
              >
                次の問題
              </button>
              <button
                type="button"
                onClick={resetSession}
                className="rounded border border-rose-500 px-4 py-2 text-rose-300"
              >
                スコアをリセット
              </button>
            </div>
          </>
        )}
      </div>

      {result && (
        <section className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-5 space-y-2">
          <p className="text-xl font-bold">
            判定: {result.isCorrect ? '✅ 正解' : '❌ 不正解'}
          </p>
          <p>問題の母音: {result.questionVowels}</p>
          <p>あなたの選択母音: {result.selectedChoiceVowels.join(', ') || 'なし'}</p>
          <p>解説: {result.explanation}</p>
        </section>
      )}
    </main>
  )
}
