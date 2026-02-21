// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { QuizPage } from './QuizPage'

describe('QuizPage', () => {
  it('shows the answer button', () => {
    render(<QuizPage />)

    expect(screen.getByRole('button', { name: '解答' })).toBeTruthy()
  })
})
