import { Timeslot } from '@server/entities'
import { TimeslotInsert } from '@server/entities/timeslot'
import { DataSource } from 'typeorm'

export async function checkTimeslotOverlap(
  input: TimeslotInsert,
  db: DataSource
) {
  const overlappingTimeslot = await db
    .getRepository(Timeslot)
    .createQueryBuilder('timeslot')
    .where('timeslot.trainerId = :trainerId', { trainerId: input.trainerId })
    .andWhere('timeslot.day_of_week = :day_of_week', {
      day_of_week: input.day_of_week,
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
