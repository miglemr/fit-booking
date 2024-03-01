import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Trainer } from '@server/entities'
import { fakeTrainer, fakeAdmin } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import trainerRouter from '..'

const db = await createTestDatabase()
const trainerRepository = db.getRepository(Trainer)

const createCaller = createCallerFactory(trainerRouter)

const { create } = createCaller(authContext({ db }, fakeAdmin()))

it('should save a trainer', async () => {
  const trainer = fakeTrainer()

  const response = await create(trainer)

  const trainerCreated = await trainerRepository.findOneByOrFail({
    firstName: trainer.firstName,
    lastName: trainer.lastName,
  })
  expect(trainerCreated).toEqual({
    ...trainer,
    id: expect.any(Number),
  })
  expect(response).toEqual({
    ...trainer,
    id: expect.any(Number),
  })

  expect(response.id).toEqual(trainerCreated!.id)
})

it('should save trainer with first name and last name trimmed', async () => {
  const trainer = {
    firstName: '  Jane  ',
    lastName: 'Doe  ',
  }

  await create(trainer)

  await expect(
    trainerRepository.findOneByOrFail({
      firstName: 'Jane',
      lastName: 'Doe',
    })
  ).resolves.not.toThrow()
})
