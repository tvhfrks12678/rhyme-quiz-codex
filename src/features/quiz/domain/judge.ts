export function judgeAnswer(correctChoiceIds: string[], selectedChoiceIds: string[]) {
  const normalizedCorrect = [...new Set(correctChoiceIds)].sort()
  const normalizedSelected = [...new Set(selectedChoiceIds)].sort()

  if (normalizedCorrect.length !== normalizedSelected.length) {
    return false
  }

  return normalizedCorrect.every((value, index) => value === normalizedSelected[index])
}

export function calculateScore(results: boolean[]) {
  return results.reduce((score, isCorrect) => (isCorrect ? score + 1 : score), 0)
}
