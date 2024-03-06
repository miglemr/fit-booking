import { Session } from '@server/entities'
import { sessionInsertSchema } from '@server/entities/session'
import { adminProcedure } from '@server/trpc/adminProcedure'
import { checkSessionOverlap } from './service'

export default adminProcedure
  .input(sessionInsertSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    await checkSessionOverlap(input, db)

    const record = db.getRepository(Session).create(input)
    const session = await db.getRepository(Session).save(record)

    return session
  })
