import { test, expect, type Page } from '@playwright/test'
import { removeToken, loginNewAdmin } from 'utils/api'

test.describe('managing classes', () => {
  test('admin can add new class', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin/classes')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('textbox', { name: 'Enter name' }).fill('Spin class')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.getByTestId('class').last()).toBeVisible()
    await expect(page.getByTestId('class').last()).toContainText('Spin class')

    await deleteData(page)
  })

  test('admin can update class name', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin/classes')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('textbox', { name: 'Enter name' }).fill('Gym')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByRole('textbox').fill('Gym class')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByTestId('class').last()).toContainText('Gym class')

    await deleteData(page)
  })

  test('admin can delete class', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin/classes')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('textbox', { name: 'Enter name' }).fill('Pole fitness')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Delete' }).last().click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.getByText('Pole fitness').last()).not.toBeVisible()
  })
})

async function deleteData(page: Page) {
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  await removeToken(page)
}
