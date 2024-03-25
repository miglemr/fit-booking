import { test, expect } from '@playwright/test'
import { loginNewAdmin } from 'utils/api'

test.describe.serial('admin login sequence', () => {
  test('admin can access admin panel', async ({ page }) => {
    await loginNewAdmin(page)

    await page.goto('/admin')

    await expect(page).toHaveURL('/admin')

    await page.reload()
    await page.waitForURL('/admin')
  })

  test('admin can not access bookings page', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin')

    await page.goto('/user')

    await page.waitForURL('/admin')
  })

  test('admin can logout', async ({ page }) => {
    await loginNewAdmin(page)
    await page.goto('/admin')
    const logoutLink = page.getByRole('link', { name: 'Logout' })

    await logoutLink.click()

    await expect(logoutLink).toBeHidden()
    await expect(page).toHaveURL('/login')

    await page.goto('/admin')
    await expect(logoutLink).toBeHidden()
    await expect(page).toHaveURL('/login')
  })
})
