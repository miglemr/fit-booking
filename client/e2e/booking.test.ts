import { test, expect, Page } from '@playwright/test'
import { signupUser, removeToken, loginNewAdmin } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

test.describe('managing bookings', () => {
  test('user can book a session', async ({ page }) => {
    await populateDatabase(page)
    await page.goto('/')
    const user = fakeUser()
    await signupUser(user)
    await page.goto('/login')
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(user.email)
    await form.locator('input[type="password"]').fill(user.password)
    await form.locator('button[type="submit"]').click()
    await page.waitForURL('/user')

    await page.goto('/user/sessions')
    await page.getByRole('button', { name: 'Book' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.goto('/user')

    await expect(page.getByTestId('session')).toBeVisible()

    await deleteData(page)
  })

  test('user can cancel a booking', async ({ page }) => {
    await populateDatabase(page)
    await page.goto('/')
    const user = fakeUser()
    await signupUser(user)
    await page.goto('/login')
    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(user.email)
    await form.locator('input[type="password"]').fill(user.password)
    await form.locator('button[type="submit"]').click()
    await page.waitForURL('/user')
    await page.goto('/user/sessions')
    await page.getByRole('button', { name: 'Book' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await page.goto('/user')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.getByText('Gym class')).not.toBeVisible()

    await deleteData(page)
  })
})

async function populateDatabase(page: Page) {
  await loginNewAdmin(page)

  await page.goto('/admin/trainers')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('textbox', { name: 'Enter first name' }).fill('Joe')
  await page.getByRole('textbox', { name: 'Enter last name' }).fill('Smith')
  await page.getByRole('button', { name: 'Confirm' }).click()

  await page.goto('/admin/classes')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('textbox', { name: 'Enter name' }).fill('Gym class')
  await page.getByRole('button', { name: 'Confirm' }).click()

  await page.goto('/admin')
  await page.getByRole('button', { name: 'Create' }).click()
  await page.getByLabel('Select trainer').selectOption('Joe Smith')
  await page.getByLabel('Select class').selectOption('Gym class')
  await page.fill('#startTime', '16:00')
  await page.fill('#endTime', '17:00')
  await page.locator('#spots').fill('5')
  await page.getByRole('button', { name: 'Confirm' }).click()

  await removeToken(page)
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
