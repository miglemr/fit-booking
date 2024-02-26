import { Timeslot, Trainer, Sport } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import {
  fakeAdmin,
  fakeTimeslot,
  fakeSport,
  fakeTrainer,
} from '@server/entities/tests/fakes'
import timeslotRouter from '..'

const db = await createTestDatabase()
const timeslotRepository = db.getRepository(Timeslot)

const createCaller = createCallerFactory(timeslotRouter)

const { findByDay } = createCaller(authContext({ db }, fakeAdmin()))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should find all timeslots for provided day of the week', async () => {
  await timeslotRepository.save([
    fakeTimeslot({ trainerId: 1, sportId: 1, day_of_week: 1 }),
    fakeTimeslot({ trainerId: 1, sportId: 1, day_of_week: 1 }),
    fakeTimeslot({ trainerId: 1, sportId: 1, day_of_week: 2 }),
  ])

  const response = await findByDay({ day_of_week: 1 })

  expect(response).toHaveLength(2)
})
