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
import sessionRouter from '..'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const user = fakeUser()
await db.getRepository(User).save(user)

const { cancelBooking } = createCaller(authContext({ db }, user))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should cancel a session booking', async () => {
  await sessionRepository.save([
    fakeSession({ sportId: 1, trainerId: 1 }),
    fakeSession({ sportId: 1, trainerId: 1 }),
  ])

  await cancelBooking({ id: 1 })

  const sessionWithUsers = await db.getRepository(Session).findOneOrFail({
    where: { id: 1 },
    relations: {
      users: true,
    },
  })
  expect(sessionWithUsers.users).toHaveLength(0)
  expect(sessionWithUsers.spotsLeft).toEqual(10)
})
