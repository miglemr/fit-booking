import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Sport } from '@server/entities'
import { fakeAdmin, fakeSport } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sportRouter from '..'

const db = await createTestDatabase()
const sportRepository = db.getRepository(Sport)

const createCaller = createCallerFactory(sportRouter)

const { update } = createCaller(authContext({ db }, fakeAdmin()))

it('should update sport', async () => {
  const sport = fakeSport({
    name: 'Pole sport',
  })
  await db.getRepository(Sport).save(sport)

  const updatedName = 'Pole fitness'
  await update({ id: 1, name: updatedName })

  const sportFound = await sportRepository.findBy({ id: 1 })
  expect(sportFound[0].name).toEqual(updatedName)
})

it('should not update sport if name is an empty string', async () => {
  const sport = fakeSport({
    name: 'Pole sport',
  })
  await db.getRepository(Sport).save(sport)

  const updatedName = ''
  await expect(update({ id: 2, name: updatedName })).rejects.toThrowError()
})
