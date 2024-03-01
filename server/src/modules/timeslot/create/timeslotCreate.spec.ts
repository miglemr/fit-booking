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

const { create } = createCaller(authContext({ db }, fakeAdmin()))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should save a timeslot', async () => {
  const timeslot = fakeTimeslot({ trainerId: 1, sportId: 1 })

  const response = await create(timeslot)

  expect(response).toEqual({
    ...timeslot,
    id: expect.any(Number),
    timeStart: expect.stringContaining(':00'),
    timeEnd: expect.stringContaining(':00'),
    spotsTotal: 10,
  })
  const timeslotFound = await timeslotRepository.find()
  expect(timeslotFound).toEqual([
    {
      ...timeslot,
      id: expect.any(Number),
      timeStart: expect.stringContaining(':00'),
      timeEnd: expect.stringContaining(':00'),
      spotsTotal: 10,
    },
  ])
})

it('should throw an error if there is an overlapping timeslot', async () => {
  await create(
    fakeTimeslot({
      trainerId: 1,
      sportId: 1,
      dayOfWeek: 1,
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    create(
      fakeTimeslot({
        trainerId: 1,
        sportId: 1,
        dayOfWeek: 1,
        timeStart: '10:30',
        timeEnd: '11:30',
      })
    )
  ).rejects.toThrow(/overlaps/)
})

it('should throw an error if day of the week is invalid', async () => {
  await expect(
    create(
      fakeTimeslot({
        trainerId: 1,
        sportId: 1,
        dayOfWeek: 8,
      })
    )
  ).rejects.toThrow()
})

it('should throw an error if time is invalid', async () => {
  await expect(
    create(
      fakeTimeslot({
        trainerId: 1,
        sportId: 1,
        timeStart: '26:00',
      })
    )
  ).rejects.toThrow()
})

it('should throw an error if referenced sport ID is invalid', async () => {
  await expect(
    create(
      fakeTimeslot({
        trainerId: 111,
        sportId: 1,
      })
    )
  ).rejects.toThrow()
})

it('should throw an error if referenced trainer ID is invalid', async () => {
  await expect(
    create(
      fakeTimeslot({
        trainerId: 1,
        sportId: 111,
      })
    )
  ).rejects.toThrow()
})
