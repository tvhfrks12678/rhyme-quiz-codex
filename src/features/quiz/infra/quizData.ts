export type QuizChoiceInternal = {
  id: string
  text: string
  vowels: string
  isCorrect: boolean
}

export type QuizQuestionInternal = {
  id: string
  prompt: string
  questionVowels: string
  image: {
    kind: 'assetKey'
    value: string
  }
  explanation: string
  choices: QuizChoiceInternal[]
}

export const quizData: QuizQuestionInternal[] = [
  {
    id: 'q1',
    prompt: 'このトラックのキーワードは「虎（とら）」だ。どれが一番韻を踏んでる？',
    questionVowels: 'oa',
    image: { kind: 'assetKey', value: 'tora' },
    explanation:
      '「とら」は母音が「o-a」。同じ流れの「ソファ（o-a）」が強い押韻になります。',
    choices: [
      { id: 'q1-c1', text: 'ソファ', vowels: 'oa', isCorrect: true },
      { id: 'q1-c2', text: 'キリン', vowels: 'ii', isCorrect: false },
      { id: 'q1-c3', text: 'ハサミ', vowels: 'ai', isCorrect: false },
      { id: 'q1-c4', text: 'ドラマ', vowels: 'oa', isCorrect: true },
    ],
  },
  {
    id: 'q2',
    prompt: '「ビート」にハマる語感を選べ',
    questionVowels: 'ii',
    image: { kind: 'assetKey', value: 'beat' },
    explanation:
      '「ビート」は「i-i」。同じく「チーズ」「シーン」など伸びる i 音が相性◎。',
    choices: [
      { id: 'q2-c1', text: 'チーズ', vowels: 'ii', isCorrect: true },
      { id: 'q2-c2', text: 'コード', vowels: 'oo', isCorrect: false },
      { id: 'q2-c3', text: 'ハード', vowels: 'aa', isCorrect: false },
      { id: 'q2-c4', text: 'シーン', vowels: 'ii', isCorrect: true },
    ],
  },
]
