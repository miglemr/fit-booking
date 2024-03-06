import { Session, Trainer, Sport, User } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeSession,
  fakeSport,
  fakeTrainer,
  fakeUser,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import * as sendEmail from '@server/modules/sendEmail'
import sessionRouter from '../../index'
import { generateEmailContent } from './service'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const user = fakeUser()
await db.getRepository(User).save(user)

const { book } = createCaller(authContext({ db }, user))

vi.mock('@server/modules/sendEmail', () => ({ default: vi.fn() }))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should book a session', async () => {
  const sendEmailSpy = vi.spyOn(sendEmail, 'default')
  await sessionRepository.save([
    fakeSession({ sportId: 1, trainerId: 1 }),
    fakeSession({ sportId: 1, trainerId: 1 }),
  ])

  await book({ id: 1 })

  const sessionWithUsers = await db.getRepository(Session).findOneOrFail({
    where: { id: 1 },
    relations: {
      users: true,
    },
  })
  expect(sessionWithUsers.users).toHaveLength(1)
  expect(sessionWithUsers.spotsLeft).toEqual(9)
  expect(sendEmailSpy).toBeCalledTimes(1)
  expect(sendEmailSpy).toBeCalledWith(
    user.email,
    generateEmailContent(user.firstName, sessionWithUsers)
  )
})

it('should throw an error if there is an overlapping booking', async () => {
  const sendEmailSpy = vi.spyOn(sendEmail, 'default')
  await sessionRepository.save([
    fakeSession({
      sportId: 1,
      trainerId: 1,
      date: '2024-02-25',
      timeStart: '10:00',
      timeEnd: '11:00',
    }),
    fakeSession({
      sportId: 2,
      trainerId: 2,
      date: '2024-02-25',
      timeStart: '10:30',
      timeEnd: '11:30',
    }),
  ])
  await expect(book({ id: 3 })).resolves.not.toThrow()

  await expect(book({ id: 4 })).rejects.toThrow(/overlaps/)
  expect(sendEmailSpy).toBeCalledTimes(1)
})

it('should throw an error if session is cancelled', async () => {
  const sendEmailSpy = vi.spyOn(sendEmail, 'default')
  await sessionRepository.save(
    fakeSession({
      sportId: 1,
      trainerId: 1,
      date: '2024-02-25',
      timeStart: '10:00',
      timeEnd: '11:00',
      isCancelled: true,
    })
  )

  await expect(book({ id: 5 })).rejects.toThrow(/cancel/)
  expect(sendEmailSpy).not.toBeCalled()
})
