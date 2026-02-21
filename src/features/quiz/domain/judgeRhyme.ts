export function normalizeVowels(vowels: string): string {
  return vowels.trim().toLowerCase()
}

export function judgeRhyme(questionVowels: string, choiceVowels: string): boolean {
  return normalizeVowels(questionVowels) === normalizeVowels(choiceVowels)
}
