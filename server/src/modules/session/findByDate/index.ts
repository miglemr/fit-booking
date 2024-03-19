import { Session } from '@server/entities'
import { sessionSchema } from '@server/entities/session'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(sessionSchema.pick({ date: true }))
  .query(async ({ input: { date }, ctx: { db } }) =>
    db.getRepository(Session).find({
      where: { date },
      order: {
        timeStart: 'ASC',
      },
    })
  )
