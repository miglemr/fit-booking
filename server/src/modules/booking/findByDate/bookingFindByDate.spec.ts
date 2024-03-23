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
const userTwo = fakeUser()
await db.getRepository(User).save([user, userTwo])

const { findByDate } = createCaller(authContext({ db }, user))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should find all user sessions', async () => {
  const date = '2024-03-18'
  const session = fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [user],
    date,
  })
  const sessionTwo = fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [user],
    date,
  })
  const sessionThree = fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [userTwo],
    date,
  })
  const sessionFour = fakeSession({
    sportId: 1,
    trainerId: 1,
  })
  await sessionRepository.save([session, sessionTwo, sessionThree, sessionFour])

  const response = await findByDate({ date })

  expect(response).toHaveLength(2)
})
