import { describe, expect, it } from 'vitest'
import { calculateScore, judgeAnswer } from '../judge'

describe('judgeAnswer', () => {
  it('returns true when selected choices exactly match correct choices', () => {
    expect(judgeAnswer(['a', 'b'], ['b', 'a'])).toBe(true)
  })

  it('returns false when any choice does not match', () => {
    expect(judgeAnswer(['a', 'b'], ['a', 'c'])).toBe(false)
  })
})

describe('calculateScore', () => {
  it('counts number of correct answers', () => {
    expect(calculateScore([true, false, true, true])).toBe(3)
  })
})
