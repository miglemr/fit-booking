import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { Timeslot, Trainer, Sport, Session } from '@server/entities'
import {
  fakeTimeslot,
  fakeTrainer,
  fakeSport,
  fakeAdmin,
  fakeSession,
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

it('should remove all future sessions that reference the deleted timeslot', async () => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  await timeslotRepository.save(fakeTimeslot({ trainerId: 1, sportId: 2 }))
  await db.getRepository(Session).save(
    fakeSession({
      trainerId: 1,
      sportId: 1,
      timeslotId: 3,
      date: tomorrow.toISOString(),
    })
  )

  await remove({ id: 3 })

  await expect(
    db.getRepository(Session).findOneByOrFail({ id: 1 })
  ).rejects.toThrow()
})

it('should set timeslot ID to null for all past sessions referencing deleted timeslot', async () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  await timeslotRepository.save(fakeTimeslot({ trainerId: 1, sportId: 2 }))
  await db.getRepository(Session).save(
    fakeSession({
      trainerId: 1,
      sportId: 1,
      timeslotId: 4,
      date: yesterday.toISOString(),
    })
  )

  await remove({ id: 4 })

  const session = await db.getRepository(Session).findOneByOrFail({ id: 2 })
  expect(session.timeslotId).toBe(null)
})
