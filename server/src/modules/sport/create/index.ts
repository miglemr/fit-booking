import { Sport, sportInsertSchema } from '@server/entities/sport'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(sportInsertSchema)
  .mutation(async ({ input, ctx: { db } }) => {
    const sport = await db.getRepository(Sport).save(input)

    return sport
  })
