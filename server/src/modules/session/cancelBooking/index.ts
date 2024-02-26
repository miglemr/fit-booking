import { Session } from '@server/entities'
import { sessionSchema } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

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

    await db.getRepository(Session).save(sessionWithUsers)
  })
