import { Sport, sportSchema } from '@server/entities/sport'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(sportSchema)
  .mutation(async ({ input: { id, name }, ctx: { db } }) =>
    db.getRepository(Sport).update(id, { name })
  )
