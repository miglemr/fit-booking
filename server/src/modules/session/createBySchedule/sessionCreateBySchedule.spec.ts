import { Session, Trainer, Sport, Timeslot } from '@server/entities'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeAdmin,
  fakeSport,
  fakeTimeslot,
  fakeTrainer,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import sessionRouter from '..'

const db = await createTestDatabase()
const sessionRepository = db.getRepository(Session)

const createCaller = createCallerFactory(sessionRouter)

const { createBySchedule } = createCaller(authContext({ db }, fakeAdmin()))

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should save all sessions from schedule', async () => {
  await db.getRepository(Timeslot).save([
    fakeTimeslot({
      dayOfWeek: 1,
      trainerId: 1,
      sportId: 1,
    }),
    fakeTimeslot({
      dayOfWeek: 1,
      trainerId: 2,
      sportId: 2,
    }),
    fakeTimeslot({
      dayOfWeek: 2,
      trainerId: 2,
      sportId: 2,
    }),
  ])
  const testDate = new Date('2024-03-04')

  const response = await createBySchedule({ date: testDate })

  const sessionsFound = await sessionRepository.findBy({ date: '2024-03-04' })
  expect(response).toHaveLength(2)
  expect(sessionsFound).toEqual([
    {
      id: expect.any(Number),
      sportId: 1,
      sport: expect.any(Object),
      trainerId: 1,
      trainer: expect.any(Object),
      date: '2024-03-04',
      timeStart: expect.stringContaining(':00'),
      timeEnd: expect.stringContaining(':00'),
      spotsTotal: 10,
      spotsLeft: 10,
      isCancelled: false,
    },
    {
      id: expect.any(Number),
      sportId: 2,
      sport: expect.any(Object),
      trainerId: 2,
      trainer: expect.any(Object),
      date: '2024-03-04',
      timeStart: expect.stringContaining(':00'),
      timeEnd: expect.stringContaining(':00'),
      spotsTotal: 10,
      spotsLeft: 10,
      isCancelled: false,
    },
  ])
})

it('should throw an error if there are no timeslots for this day', async () => {
  const testDate = new Date('2024-03-06')

  await expect(createBySchedule({ date: testDate })).rejects.toThrow(
    /No timeslots found/
  )
})
