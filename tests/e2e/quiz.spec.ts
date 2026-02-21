import { expect, test } from '@playwright/test'

test('quiz page displays answer button and shows correct/incorrect result', async ({
  page,
}) => {
  await page.goto('/quiz')

  await expect(page.getByRole('button', { name: '解答' })).toBeVisible()

  await page.getByLabel('ウミ').check()
  await page.getByRole('button', { name: '解答' }).click()
  await expect(page.getByText('不正解')).toBeVisible()

  await page.getByRole('button', { name: 'リセット' }).click()
  await page.getByLabel('ソラ').check()
  await page.getByRole('button', { name: '解答' }).click()
  await expect(page.getByText('正解')).toBeVisible()
})
