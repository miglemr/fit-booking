import { Session, Trainer, Sport } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeAdmin,
  fakeSession,
  fakeSport,
  fakeTrainer,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sessionRouter from '..'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const { cancel } = createCaller(authContext({ db }, fakeAdmin()))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

await sessionRepository.save([
  fakeSession({ sportId: 1, trainerId: 1 }),
  fakeSession({
    sportId: 1,
    trainerId: 1,
  }),
])

it('should cancel a session', async () => {
  await cancel({ id: 1 })

  const sessionsFound = await sessionRepository.find()
  expect(sessionsFound).toHaveLength(2)
  const updatedSession = await sessionRepository.findOneBy({ id: 1 })
  expect(updatedSession?.isCancelled).toEqual(true)
})
