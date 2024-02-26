import { random } from '@tests/utils/random'
import type { User, Trainer, Sport, Timeslot } from '..'
import { sports } from './fixtures'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  isAdmin: false,
  ...overrides,
})

/**
 * Generates a fake admin with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeAdmin = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: 'Password.123!',
  isAdmin: true,
  ...overrides,
})

/**
 * Generates a fake trainer with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeTrainer = <T extends Partial<Trainer>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  firstName: random.first(),
  lastName: random.last(),
  ...overrides,
})

/**
 * Generates a fake sport with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeSport = <T extends Partial<Sport>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: sports[Math.floor(Math.random() * sports.length)],
  ...overrides,
})

/**
 * Generates a fake timeslot with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeTimeslot = <T extends Partial<Timeslot>>(
  overrides: T = {} as T
) => {
  const hour = random.hour({ twentyfour: true })

  return {
    id: randomId(),
    day_of_week: random.integer({ min: 0, max: 6 }),
    timeStart: `${hour}:00`,
    timeEnd: `${hour + 1}:00`,
    spotsTotal: 10,
    ...overrides,
  }
}

/**
 * Generates a fake session with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeSession = <T extends Partial<Timeslot>>(
  overrides: T = {} as T
) => {
  const year = new Date(Date.now()).getFullYear()

  const date = new Date(random.date({ string: true, year, month: 2 }))
    .toISOString()
    .substring(0, 10)
  const hour = random.hour({ twentyfour: true })

  return {
    id: randomId(),
    date,
    timeStart: `${hour}:00`,
    timeEnd: `${hour + 1}:00`,
    spotsTotal: 10,
    ...overrides,
  }
}
