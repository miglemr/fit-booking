import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Trainer } from '@server/entities'
import { fakeAdmin, fakeTrainer } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import trainerRouter from '..'

const db = await createTestDatabase()
const trainerRepository = db.getRepository(Trainer)

const createCaller = createCallerFactory(trainerRouter)

const { update } = createCaller(authContext({ db }, fakeAdmin()))

it('should update Trainer', async () => {
  const trainer = fakeTrainer({
    firstName: 'Jane',
    lastName: 'Doe',
  })
  await db.getRepository(Trainer).save(trainer)

  const updatedTrainer = { id: 1, firstName: 'Janet' }
  await update(updatedTrainer)

  const trainerFound = await trainerRepository.findBy({ id: 1 })
  expect(trainerFound[0].firstName).toEqual(updatedTrainer.firstName)
})

it('should not update trainer if name is an empty string', async () => {
  const trainer = fakeTrainer({
    firstName: 'Jane',
    lastName: 'Doe',
  })
  await db.getRepository(Trainer).save(trainer)

  const updatedTrainer = { id: 2, firstName: '' }

  await expect(update(updatedTrainer)).rejects.toThrowError()
})
