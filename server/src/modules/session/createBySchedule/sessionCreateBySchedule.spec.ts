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
  const startDate = new Date('2024-03-22')
  const endDate = new Date('2024-03-27')

  await createBySchedule({ startDate, endDate })

  const mondaySessions = await sessionRepository.findBy({ date: '2024-03-25' })
  const tuesdaySessions = await sessionRepository.findBy({ date: '2024-03-26' })
  const wednesdaySessions = await sessionRepository.findBy({
    date: '2024-03-27',
  })
  expect(mondaySessions).toHaveLength(2)
  expect(tuesdaySessions).toHaveLength(1)
  expect(wednesdaySessions).toHaveLength(0)
})

it('should not save already existing sessions', async () => {
  await db.getRepository(Timeslot).save([
    fakeTimeslot({
      dayOfWeek: 3,
      trainerId: 1,
      sportId: 1,
    }),
    fakeTimeslot({
      dayOfWeek: 3,
      trainerId: 2,
      sportId: 2,
    }),
    fakeTimeslot({
      dayOfWeek: 4,
      trainerId: 2,
      sportId: 2,
    }),
  ])
  const startDate = new Date('2024-03-29')
  const endDate = new Date('2024-04-05')
  await createBySchedule({ startDate, endDate })
  await db.getRepository(Timeslot).save(
    fakeTimeslot({
      dayOfWeek: 4,
      trainerId: 1,
      sportId: 1,
    })
  )

  await createBySchedule({ startDate, endDate })

  const wednesdaySessions = await sessionRepository.findBy({
    date: '2024-04-03',
  })
  const thursdaySessions = await sessionRepository.findBy({
    date: '2024-04-04',
  })
  expect(wednesdaySessions).toHaveLength(2)
  expect(thursdaySessions).toHaveLength(2)
})
