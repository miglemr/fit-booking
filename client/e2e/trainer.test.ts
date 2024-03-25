import { test, expect, type Page } from '@playwright/test'
import { removeToken, loginNewAdmin } from 'utils/api'

test.describe('managing trainers', () => {
  test('admin can add new trainer', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin/trainers')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('textbox', { name: 'Enter first name' }).fill('Jane')
    await page.getByRole('textbox', { name: 'Enter last name' }).fill('Doe')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.getByTestId('trainer').last()).toContainText('Jane Doe')

    await deleteData(page)
  })

  test('admin can update trainer name', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin/trainers')

    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('textbox', { name: 'Enter first name' }).fill('John')
    await page.getByRole('textbox', { name: 'Enter last name' }).fill('Doe')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Edit' }).last().click()
    await page.getByRole('textbox').nth(0).fill('Janet')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByTestId('trainer').last()).toContainText('Janet Doe')

    await deleteData(page)
  })

  test('admin can delete trainer', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin/trainers')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.getByRole('textbox', { name: 'Enter first name' }).fill('Sam')
    await page.getByRole('textbox', { name: 'Enter last name' }).fill('Doe')
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Delete' }).last().click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.getByText('Sam Doe')).not.toBeVisible()
  })
})

async function deleteData(page: Page) {
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  await removeToken(page)
}
