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
import sessionRouter from '../..'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const user = fakeUser()
const userTwo = fakeUser()
await db.getRepository(User).save([user, userTwo])

const { findByUserId } = createCaller(authContext({ db }, user))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should find all user sessions', async () => {
  const session = fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [user],
  })
  const sessionTwo = fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [user],
  })
  const sessionThree = fakeSession({
    sportId: 1,
    trainerId: 1,
    users: [userTwo],
  })
  const sessionFour = fakeSession({
    sportId: 1,
    trainerId: 1,
  })
  await sessionRepository.save([session, sessionTwo, sessionThree, sessionFour])

  const response = await findByUserId()

  expect(response).toHaveLength(2)
  expect(response[0]).toHaveProperty('sport')
  expect(response[0]).toHaveProperty('trainer')
})
