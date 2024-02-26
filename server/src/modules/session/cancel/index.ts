import { Session } from '@server/entities'
import { sessionSchema } from '@server/entities/session'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(sessionSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    await db.getRepository(Session).update({ id }, { isCancelled: true })
  })
