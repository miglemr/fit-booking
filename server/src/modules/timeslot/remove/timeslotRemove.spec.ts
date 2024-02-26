import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Timeslot, Trainer, Sport } from '@server/entities'
import {
  fakeTimeslot,
  fakeTrainer,
  fakeSport,
  fakeAdmin,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import timeslotRouter from '..'

const db = await createTestDatabase()
const timeslotRepository = db.getRepository(Timeslot)

const createCaller = createCallerFactory(timeslotRouter)

const { remove } = createCaller(authContext({ db }, fakeAdmin()))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should remove timeslot', async () => {
  const timeslot = fakeTimeslot({ trainerId: 1, sportId: 1 })
  await timeslotRepository.save([
    timeslot,
    fakeTimeslot({ trainerId: 1, sportId: 2 }),
  ])

  await remove({ id: 1 })

  const timeslotsFound = await timeslotRepository.find()
  expect(timeslotsFound).toHaveLength(1)
  expect(timeslotsFound[0].id).not.toEqual(1)
})
