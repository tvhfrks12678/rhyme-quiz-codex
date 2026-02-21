import { describe, expect, it } from 'vitest'

import { judgeRhyme, normalizeVowels } from './judgeRhyme'

describe('normalizeVowels', () => {
  it('trims and lowercases vowels', () => {
    expect(normalizeVowels('  AIO  ')).toBe('aio')
  })
})

describe('judgeRhyme', () => {
  it('returns true when vowels match', () => {
    expect(judgeRhyme('oa', 'oa')).toBe(true)
  })

  it('returns true with extra spaces and casing differences', () => {
    expect(judgeRhyme(' OA ', 'oa')).toBe(true)
  })

  it('returns false when vowels are different', () => {
    expect(judgeRhyme('oa', 'ui')).toBe(false)
  })
})
