import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Trainer } from '@server/entities'
import { fakeTrainer, fakeAdmin } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import trainerRouter from '..'

const db = await createTestDatabase()
const trainerRepository = db.getRepository(Trainer)

const createCaller = createCallerFactory(trainerRouter)

const { remove } = createCaller(authContext({ db }, fakeAdmin()))

it('should remove trainer', async () => {
  const trainer = fakeTrainer()
  await trainerRepository.save([trainer, fakeTrainer()])

  await remove({ id: 1 })

  const trainersFound = await trainerRepository.find()
  expect(trainersFound).toHaveLength(1)
  expect(trainersFound[0].id).not.toEqual(1)
})
