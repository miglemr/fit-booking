import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Sport } from '@server/entities'
import { fakeSport, fakeAdmin } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sportRouter from '..'

const db = await createTestDatabase()
const sportRepository = db.getRepository(Sport)

const createCaller = createCallerFactory(sportRouter)

const { create } = createCaller(authContext({ db }, fakeAdmin()))

it('should save a sport', async () => {
  const sport = fakeSport()
  const response = await create(sport)

  const sportCreated = await sportRepository.findOneByOrFail({})

  expect(sportCreated).toEqual({
    ...sport,
    id: expect.any(Number),
  })

  expect(response).toEqual({
    ...sport,
    id: expect.any(Number),
  })

  expect(response.id).toEqual(sportCreated!.id)
})

it('should throw an error if name is not provided', async () => {
  await expect(create({ name: '' })).rejects.toThrow()
})

it('should save sport name trimmed', async () => {
  const trainer = {
    name: '  Gym  ',
  }

  await create(trainer)

  await expect(
    sportRepository.findOneByOrFail({
      name: 'Gym',
    })
  ).resolves.not.toThrow()
})
