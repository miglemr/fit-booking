import { Sport } from '@server/entities'
import { sportSchema } from '@server/entities/sport'
import { adminProcedure } from '@server/trpc/adminProcedure'

export default adminProcedure
  .input(sportSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    await db.getRepository(Sport).delete(id)
  })
