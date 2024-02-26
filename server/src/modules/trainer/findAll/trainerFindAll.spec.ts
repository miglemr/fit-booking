import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Trainer } from '@server/entities'
import { fakeTrainer, fakeAdmin } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import trainerRouter from '..'

const db = await createTestDatabase()
const trainerRepository = db.getRepository(Trainer)

const createCaller = createCallerFactory(trainerRouter)

const { findAll } = createCaller(authContext({ db }, fakeAdmin()))

it('should find all trainers', async () => {
  await trainerRepository.save([fakeTrainer(), fakeTrainer()])

  const trainers = await findAll()

  expect(trainers).toHaveLength(2)
})
