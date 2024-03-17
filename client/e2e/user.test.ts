import { test, expect } from '@playwright/test'
import { loginNewUser, signupUser } from 'utils/api'
import { fakeUser } from 'utils/fakeData'

const { firstName, email, password } = fakeUser()

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup', async ({ page }) => {
    await page.goto('/signup')
    const successMessage = page.getByTestId('successMessage')
    await expect(successMessage).toBeHidden() // sanity check

    const form = page.getByRole('form', { name: 'Signup' })
    await form.locator('input[type="text"]').fill(firstName)
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    await expect(successMessage).toBeVisible()
  })

  test('visitor can not access sessions page before login', async ({ page }) => {
    await page.goto('/user')

    await page.waitForURL('/login')
  })

  test('visitor can not access admin panel page', async ({ page }) => {
    await page.goto('/admin')

    await page.waitForURL('/login')
  })

  test('visitor can login', async ({ page }) => {
    const user = fakeUser()
    await signupUser(user)
    await page.goto('/login')

    const form = page.getByRole('form', { name: 'Login' })
    await form.locator('input[type="email"]').fill(email)
    await form.locator('input[type="password"]').fill(password)
    await form.locator('button[type="submit"]').click()

    await page.waitForURL('/user')

    await page.reload()
    await page.waitForURL('/user')
  })
})

test('logged visitor can not access admin panel page', async ({ page }) => {
  await loginNewUser(page)

  await page.goto('/admin')

  await page.waitForURL('/user')
})

test('visitor can logout', async ({ page }) => {
  await loginNewUser(page)
  await page.goto('/user')
  const logoutLink = page.getByRole('link', { name: 'Logout' })

  await logoutLink.click()

  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/login')

  await page.goto('/user')
  await expect(logoutLink).toBeHidden()
  await expect(page).toHaveURL('/login')
})
