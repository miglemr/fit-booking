import { Session } from '@server/entities'
import { type SessionInsert } from '@server/entities/session'
import { DataSource } from 'typeorm'

export async function checkSessionOverlap(
  input: SessionInsert,
  db: DataSource
) {
  const overlappingSessions = await db
    .getRepository(Session)
    .createQueryBuilder('session')
    .where('session.trainerId = :trainerId', { trainerId: input.trainerId })
    .andWhere('session.date = :date', { date: input.date })
    .andWhere(
      '(session.timeStart < :timeEnd AND session.timeEnd > :timeStart)',
      {
        timeStart: input.timeStart,
        timeEnd: input.timeEnd,
      }
    )
    .getMany()

  if (overlappingSessions.length > 0) {
    throw new Error('Session overlaps with existing session')
  }
}
