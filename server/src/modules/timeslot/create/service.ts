import { Timeslot } from '@server/entities'
import { type TimeslotInsert } from '@server/entities/timeslot'
import { DataSource } from 'typeorm'

export async function checkTimeslotOverlap(
  input: TimeslotInsert,
  db: DataSource
) {
  const overlappingTimeslot = await db
    .getRepository(Timeslot)
    .createQueryBuilder('timeslot')
    .where('timeslot.trainerId = :trainerId', { trainerId: input.trainerId })
    .andWhere('timeslot.dayOfWeek = :dayOfWeek', {
      dayOfWeek: input.dayOfWeek,
    })
    .andWhere(
      '(timeslot.timeStart < :timeEnd AND timeslot.timeEnd > :timeStart)',
      {
        timeStart: input.timeStart,
        timeEnd: input.timeEnd,
      }
    )
    .getMany()

  if (overlappingTimeslot.length > 0) {
    throw new Error('Timeslot overlaps with existing timeslot')
  }
}
