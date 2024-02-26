import { Trainer, Sport, Timeslot } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import {
  fakeSport,
  fakeTrainer,
  fakeTimeslot,
} from '@server/entities/tests/fakes'
import { checkTimeslotOverlap } from './service'

const db = await createTestDatabase()

await db.getRepository(Trainer).save([fakeTrainer(), fakeTrainer()])
await db.getRepository(Sport).save([fakeSport(), fakeSport()])

it('should throw an error if timeslot start time and end time is the same', async () => {
  await db.getRepository(Timeslot).save(
    fakeTimeslot({
      sportId: 1,
      trainerId: 1,
      day_of_week: 1,
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    checkTimeslotOverlap(
      fakeTimeslot({
        sportId: 1,
        trainerId: 1,
        day_of_week: 1,
        timeStart: '10:00',
        timeEnd: '11:00',
      }),
      db
    )
  ).rejects.toThrow(/overlaps/)
})

it('should throw an error if timeslot start time is in between an existing timeslot', async () => {
  await db.getRepository(Timeslot).save(
    fakeTimeslot({
      sportId: 1,
      trainerId: 1,
      day_of_week: 1,
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    checkTimeslotOverlap(
      fakeTimeslot({
        sportId: 1,
        trainerId: 1,
        day_of_week: 1,
        timeStart: '10:30',
        timeEnd: '11:30',
      }),
      db
    )
  ).rejects.toThrow(/overlaps/)
})

it('should not throw an error if there is no overlapping timeslot', async () => {
  await db.getRepository(Timeslot).save(
    fakeTimeslot({
      sportId: 1,
      trainerId: 1,
      day_of_week: 1,
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    checkTimeslotOverlap(
      fakeTimeslot({
        sportId: 1,
        trainerId: 1,
        day_of_week: 1,
        timeStart: '11:00',
        timeEnd: '12:00',
      }),
      db
    )
  ).resolves.not.toThrow()
})

it('should not throw an error if overlapping timeslot has other trainer', async () => {
  await db.getRepository(Timeslot).save(
    fakeTimeslot({
      sportId: 1,
      trainerId: 1,
      day_of_week: 1,
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    checkTimeslotOverlap(
      fakeTimeslot({
        sportId: 1,
        trainerId: 2,
        day_of_week: 1,
        timeStart: '10:00',
        timeEnd: '11:00',
      }),
      db
    )
  ).resolves.not.toThrow()
})

it('should not throw an error if overlapping timeslot is from another day', async () => {
  await db.getRepository(Timeslot).save(
    fakeTimeslot({
      sportId: 1,
      trainerId: 1,
      day_of_week: 1,
      timeStart: '10:00',
      timeEnd: '11:00',
    })
  )

  await expect(
    checkTimeslotOverlap(
      fakeTimeslot({
        sportId: 1,
        trainerId: 1,
        day_of_week: 2,
        timeStart: '10:30',
        timeEnd: '11:30',
      }),
      db
    )
  ).resolves.not.toThrow()
})
