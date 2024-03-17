import { Chance } from 'chance'
export const random = process.env.CI ? Chance(1) : Chance()

export const fakeUser = () => ({
  firstName: random.first(),
  email: random.email(),
  password: 'password.123',
})
