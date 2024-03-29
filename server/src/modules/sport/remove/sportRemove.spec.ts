import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Sport } from '@server/entities'
import { fakeAdmin, fakeSport } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sportRouter from '..'

const db = await createTestDatabase()
const sportRepository = db.getRepository(Sport)

const createCaller = createCallerFactory(sportRouter)

const { remove } = createCaller(authContext({ db }, fakeAdmin()))

it('should remove sport', async () => {
  await db.getRepository(Sport).save([fakeSport(), fakeSport()])

  await remove({ id: 1 })

  const sportsFound = await sportRepository.find()
  expect(sportsFound).toHaveLength(1)
  expect(sportsFound[0].id).not.toEqual(1)
})
