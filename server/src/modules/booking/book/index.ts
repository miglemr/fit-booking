import { Session, User } from '@server/entities'
import { sessionSchema } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import sendEmail from '@server/modules/sendEmail'
import logger from '@server/logger'
import { checkBookingOverlap, generateEmailContent } from './service'

export default authenticatedProcedure
  .input(sessionSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
    const sessionWithUsers = await db.getRepository(Session).findOneOrFail({
      where: { id },
      relations: {
        users: true,
      },
    })

    if (sessionWithUsers.isCancelled) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Session is cancelled',
      })
    }

    const user = await db
      .getRepository(User)
      .findOneByOrFail({ id: authUser.id })

    await checkBookingOverlap(authUser, sessionWithUsers, db)

    sessionWithUsers.users = [...sessionWithUsers.users, user]
    sessionWithUsers.calculateSpotsLeft()

    const booking = await db.getRepository(Session).save(sessionWithUsers)

    try {
      await sendEmail(
        user.email,
        generateEmailContent(user.firstName, sessionWithUsers)
      )
    } catch (error) {
      logger.error(error)
    }

    return booking
  })
