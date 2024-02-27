import { Session, User } from '@server/entities'
import { sessionSchema } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import sendEmail from '@server/modules/sendEmail'
import { generateEmailContent } from './service'

export default authenticatedProcedure
  .input(sessionSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
    const sessionWithUsers = await db.getRepository(Session).findOneOrFail({
      where: { id },
      relations: {
        users: true,
      },
    })

    sessionWithUsers.users = sessionWithUsers.users.filter(
      (user) => user.id !== authUser.id
    )
    sessionWithUsers.calculateSpotsLeft()

    const cancelledBooking = await db
      .getRepository(Session)
      .save(sessionWithUsers)

    const user = await db
      .getRepository(User)
      .findOneByOrFail({ id: authUser.id })

    try {
      await sendEmail(user.email, generateEmailContent(user.firstName))
    } catch (error) {
      throw new Error('Failed to send the confirmation e-mail')
    }

    return cancelledBooking
  })
