import { test, expect, Page } from '@playwright/test'
import { removeToken, loginNewAdmin } from 'utils/api'

test.describe('managing sessions', () => {
  test('admin can create a new session', async ({ page }) => {
    await populateDatabase(page)
    await page.goto('/admin')

    await page.getByRole('button', { name: 'Create' }).click()
    await fillDefaultSession(page)
    await page.getByRole('button', { name: 'Confirm' }).click()

    const session = page.getByTestId('session').last()
    await expect(session).toBeVisible()
    await expect(session).toContainText('Yoga')
    await expect(session).toContainText('18:00 - 19:00')

    await deleteData(page)
  })

  test('admin cannot create a duplicate session', async ({ page }) => {
    await populateDatabase(page)
    await page.goto('/admin')
    await page.getByRole('button', { name: 'Create' }).click()
    await fillDefaultSession(page)
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Create' }).click()
    await fillDefaultSession(page)
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page.getByRole('form', { name: 'Create session' })).toBeVisible()
    await expect(page.getByTestId('errorMessage')).toContainText(/overlap/)

    await deleteData(page)
  })

  test('admin can cancel a session', async ({ page }) => {
    await populateDatabase(page)
    await page.goto('/admin')
    await page.getByRole('button', { name: 'Create' }).click()
    await fillDefaultSession(page)
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.getByRole('button', { name: 'Cancel' }).last().click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    const session = page.getByTestId('session').last()
    await expect(session.getByTestId('canceled-badge')).toBeVisible()

    await deleteData(page)
  })
})

async function populateDatabase(page: Page) {
  await loginNewAdmin(page)

  await page.goto('/admin/trainers')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('textbox', { name: 'Enter first name' }).fill('Jane')
  await page.getByRole('textbox', { name: 'Enter last name' }).fill('Smith')
  await page.getByRole('button', { name: 'Confirm' }).click()

  await page.goto('/admin/classes')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('textbox', { name: 'Enter name' }).fill('Yoga')
  await page.getByRole('button', { name: 'Confirm' }).click()
}

async function deleteData(page: Page) {
  await loginNewAdmin(page)

  await page.goto('/admin/trainers')
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  await page.goto('/admin/classes')
  await page.getByRole('button', { name: 'Delete' }).last().click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  await removeToken(page)
}

async function fillDefaultSession(page: Page) {
  await page.getByLabel('Select trainer').selectOption('Jane Smith')
  await page.getByLabel('Select class').selectOption('Yoga')
  await page.fill('#startTime', '18:00')
  await page.fill('#endTime', '19:00')
  await page.locator('#spots').fill('5')
}
