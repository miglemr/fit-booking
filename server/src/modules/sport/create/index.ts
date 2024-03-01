import { Sport, sportInsertSchema } from '@server/entities/sport'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(sportInsertSchema)
  .mutation(async ({ input, ctx: { db } }) =>
    db.getRepository(Sport).save(input)
  )
