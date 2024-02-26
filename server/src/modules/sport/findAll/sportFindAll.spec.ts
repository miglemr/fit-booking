import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Sport } from '@server/entities'
import { fakeSport, fakeAdmin } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sportRouter from '..'

const db = await createTestDatabase()
const sportRepository = db.getRepository(Sport)

const createCaller = createCallerFactory(sportRouter)

const { findAll } = createCaller(authContext({ db }, fakeAdmin()))

it('should find all sports', async () => {
  await sportRepository.save([fakeSport(), fakeSport()])

  const sports = await findAll()

  expect(sports).toHaveLength(2)
})
