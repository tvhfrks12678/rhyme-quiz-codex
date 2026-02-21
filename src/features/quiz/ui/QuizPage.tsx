import { useState } from 'react'

import { judgeRhyme } from '../domain/judgeRhyme'

type Choice = {
  id: string
  label: string
  vowels: string
}

const question = {
  text: '「トラ」と韻を踏む言葉を選んでください。',
  vowels: 'oa',
}

const choices: Choice[] = [
  { id: 'c1', label: 'ソラ', vowels: 'oa' },
  { id: 'c2', label: 'ウミ', vowels: 'ui' },
]

export function QuizPage() {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null)

  const handleSubmit = () => {
    if (!selectedChoiceId) {
      return
    }

    const selectedChoice = choices.find((choice) => choice.id === selectedChoiceId)

    if (!selectedChoice) {
      return
    }

    setResult(judgeRhyme(question.vowels, selectedChoice.vowels) ? 'correct' : 'incorrect')
  }

  const handleReset = () => {
    setSelectedChoiceId(null)
    setResult(null)
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h2 className="mb-4 text-2xl font-bold">韻クイズ</h2>
      <p className="mb-4">{question.text}</p>

      <fieldset className="mb-6 space-y-2" aria-label="選択肢">
        {choices.map((choice) => (
          <label key={choice.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="quiz-choice"
              checked={selectedChoiceId === choice.id}
              onChange={() => setSelectedChoiceId(choice.id)}
            />
            <span>{choice.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={!selectedChoiceId}
        >
          解答
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded border px-4 py-2"
        >
          リセット
        </button>
      </div>

      {result === 'correct' && <p className="mt-4 text-green-600">正解</p>}
      {result === 'incorrect' && <p className="mt-4 text-red-600">不正解</p>}
    </main>
  )
}
