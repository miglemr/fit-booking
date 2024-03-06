import { Session } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(async ({ ctx: { db, authUser } }) =>
  db.getRepository(Session).find({
    where: {
      users: {
        id: authUser.id,
      },
    },
  })
)
