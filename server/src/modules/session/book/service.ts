import { Session } from '@server/entities'
import { AuthUser } from '@server/entities/user'
import { DataSource } from 'typeorm'

export async function checkBookingOverlap(
  user: AuthUser,
  newSession: Session,
  db: DataSource
) {
  const overlappingBookings = await db
    .getRepository(Session)
    .createQueryBuilder('session')
    .innerJoin('session.users', 'user')
    .where('user.id = :userId', { userId: user.id })
    .andWhere('session.date = :date', { date: newSession.date })
    .andWhere(
      '(session.timeStart < :timeEnd AND session.timeEnd > :timeStart)',
      {
        timeStart: newSession.timeStart,
        timeEnd: newSession.timeEnd,
      }
    )
    .getMany()

  if (overlappingBookings.length > 0) {
    throw new Error('Booking overlaps with existing booking')
  }
}

export const generateEmailContent = (name: string, session: Session) => ({
  subject: 'Booking confirmation',
  html: `<p>Dear ${name},</p>
  <p>Your booking for the ${session.sport.name} class is confirmed.</p>
  <ul>
    <li><strong>Date:</strong> ${session.date}</li>
    <li><strong>Starts at:</strong> ${session.timeStart}</li>
    <li><strong>Ends at:</strong> ${session.timeEnd}</li>
    <li><strong>Trainer:</strong> ${session.trainer.firstName} ${session.trainer.lastName}</li>
  </ul>
  `,
})
