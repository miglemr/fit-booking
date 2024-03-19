import { Session } from '@server/entities'
import { sessionSchema } from '@server/entities/session'
import { adminProcedure } from '@server/trpc/adminProcedure'
import sendEmail from '@server/modules/sendEmail'
import logger from '@server/logger'
import { generateEmailContent } from './service'

export default adminProcedure
  .input(sessionSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const sessionWithUsers = await db.getRepository(Session).findOneOrFail({
      relations: {
        users: true,
      },
      where: { id },
    })

    const { users } = sessionWithUsers

    sessionWithUsers.users = []
    sessionWithUsers.isCancelled = true
    sessionWithUsers.calculateSpotsLeft()

    const cancelledSession = await db
      .getRepository(Session)
      .save(sessionWithUsers)

    await Promise.all(
      users.map(async (user) => {
        try {
          await sendEmail(
            user.email,
            generateEmailContent(user.firstName, sessionWithUsers)
          )
        } catch (error) {
          logger.error(error)
        }
      })
    )

    return cancelledSession
  })
